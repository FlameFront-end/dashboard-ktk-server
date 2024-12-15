import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { CreateGroupDto } from './dto/create-group.dto'
import { GroupEntity } from './entities/group.entity'
import { Lesson, ScheduleEntity } from './entities/schedule.entity'
import { TeacherEntity } from '../teachers/entities/teacher.entity'
import { StudentEntity } from '../students/entities/student.entity'
import { UpdateGroupDto } from './dto/update-group.dto'
import { DisciplineEntity } from '../disciplines/entities/discipline.entity'
import { GradeEntity } from './entities/grade.entity'
import * as moment from 'moment'
import { SaveGradesDto } from './dto/save-grades.dto'
import { ChatEntity } from '../chat/entities/chat.entity'

export interface GradeData {
	[studentId: string]: string
}

export interface DisciplineGrades {
	[date: string]: GradeData
}

@Injectable()
export class GroupsService {
	constructor(
		@InjectRepository(GroupEntity)
		private readonly groupRepository: Repository<GroupEntity>,

		@InjectRepository(ScheduleEntity)
		private readonly scheduleRepository: Repository<ScheduleEntity>,

		@InjectRepository(TeacherEntity)
		private readonly teacherRepository: Repository<TeacherEntity>,

		@InjectRepository(DisciplineEntity)
		private readonly disciplineRepository: Repository<DisciplineEntity>,

		@InjectRepository(StudentEntity)
		private readonly studentRepository: Repository<StudentEntity>,

		@InjectRepository(GradeEntity)
		private readonly gradeRepository: Repository<GradeEntity>,

		@InjectRepository(ChatEntity)
		private readonly chatRepository: Repository<ChatEntity>
	) {}

	async create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {
		const { name, teacher: teacherId, students, schedule } = createGroupDto

		const teacherEntity = await this.teacherRepository.findOne({
			where: { id: teacherId },
			relations: ['group']
		})

		if (!teacherEntity) {
			throw new NotFoundException('Teacher not found')
		}

		if (teacherEntity.group) {
			throw new BadRequestException(
				'This teacher is already assigned to a group.'
			)
		}

		let studentEntities: StudentEntity[] = []
		if (students && students.length > 0) {
			studentEntities = await this.studentRepository.findByIds(students)
		}

		const scheduleEntity = this.scheduleRepository.create({
			monday: await this.processLessons(schedule.monday),
			tuesday: await this.processLessons(schedule.tuesday),
			wednesday: await this.processLessons(schedule.wednesday),
			thursday: await this.processLessons(schedule.thursday),
			friday: await this.processLessons(schedule.friday)
		})

		const group = this.groupRepository.create({
			name,
			teacher: teacherEntity,
			students: studentEntities
		})

		await this.scheduleRepository.save(scheduleEntity)

		group.schedule = scheduleEntity
		const savedGroup = await this.groupRepository.save(group)

		teacherEntity.group = group
		await this.teacherRepository.save(teacherEntity)

		const chat = this.chatRepository.create({ groupId: savedGroup.id })
		await this.chatRepository.save(chat)

		return group
	}

	async update(
		id: string,
		updateGroupDto: UpdateGroupDto
	): Promise<GroupEntity> {
		const group = await this.groupRepository.findOne({
			where: { id },
			relations: ['schedule', 'teacher', 'students']
		})

		if (!group) {
			throw new NotFoundException('Group not found')
		}

		const { name, teacher, students, schedule } = updateGroupDto

		if (teacher) {
			group.teacher = await this.teacherRepository.findOne({
				where: { id: teacher }
			})
		}

		if (students) {
			group.students = await this.studentRepository.findByIds(students)
		}

		if (name) {
			group.name = name
		}

		if (schedule) {
			group.schedule.monday = await this.processLessons(schedule.monday || [])
			group.schedule.tuesday = await this.processLessons(schedule.tuesday || [])
			group.schedule.wednesday = await this.processLessons(
				schedule.wednesday || []
			)
			group.schedule.thursday = await this.processLessons(
				schedule.thursday || []
			)
			group.schedule.friday = await this.processLessons(schedule.friday || [])

			await this.scheduleRepository.save(group.schedule)
		}

		return await this.groupRepository.save(group)
	}

	async findAll(options: any = {}): Promise<GroupEntity[]> {
		return await this.groupRepository.find(options)
	}

	async findOne(id: string): Promise<GroupEntity> {
		const group = await this.groupRepository.findOne({
			where: { id },
			relations: ['schedule', 'teacher', 'students', 'chat']
		})

		console.log('group', group)

		if (!group) {
			throw new NotFoundException('Group not found')
		}

		return group
	}

	async findWithoutTeacher(): Promise<GroupEntity[]> {
		return this.groupRepository
			.createQueryBuilder('group')
			.leftJoinAndSelect('group.teacher', 'teacher')
			.where('teacher.id IS NULL')
			.getMany()
	}

	async remove(id: string): Promise<void> {
		await this.gradeRepository.delete({ group: { id } })
		await this.gradeRepository.update({ group: { id } }, { group: null })
		await this.groupRepository.delete(id)
	}

	async saveGrades(saveGradesDto: SaveGradesDto): Promise<{ message: string }> {
		const { groupId, grades } = saveGradesDto

		try {
			const gradeEntities: GradeEntity[] = []

			for (const disciplineId in grades) {
				for (const dateString in grades[disciplineId]) {
					const date = moment(dateString, 'YYYY-MM-DD').toDate()
					const studentGrades = grades[disciplineId][dateString]

					for (const studentId in studentGrades) {
						const gradeValue = studentGrades[studentId]

						gradeEntities.push(
							this.gradeRepository.create({
								group: { id: groupId },
								student: { id: studentId },
								discipline: { id: disciplineId },
								date: date,
								grade: gradeValue
							})
						)
					}
				}
			}

			await this.gradeRepository.save(gradeEntities)

			return { message: 'Grades saved successfully' }
		} catch (error) {
			console.error('Error saving grades:', error)
			throw error
		}
	}

	async getGrades(
		groupId: string,
		weekStart: string
	): Promise<DisciplineGrades> {
		const startDate = moment(weekStart).toDate()
		const endDate = moment(weekStart).add(6, 'days').toDate()

		try {
			const grades = await this.gradeRepository.find({
				where: {
					group: { id: groupId },
					date: Between(startDate, endDate)
				},
				relations: ['student', 'discipline']
			})

			const formattedGrades: DisciplineGrades = {}

			grades.forEach(grade => {
				const disciplineId = grade.discipline.id
				const dateStr = moment(grade.date).format('YYYY-MM-DD')
				const studentId = grade.student.id

				if (!formattedGrades[disciplineId]) {
					formattedGrades[disciplineId] = {}
				}
				if (!formattedGrades[disciplineId][dateStr]) {
					formattedGrades[disciplineId][dateStr] = <string>{}
				}

				formattedGrades[disciplineId][dateStr][studentId] = grade.grade
			})

			return formattedGrades
		} catch (error) {
			console.error('Error fetching grades:', error)
			throw error
		}
	}

	private async processLessons(lessons: any[]): Promise<Lesson[]> {
		return Promise.all(
			lessons.map(async lessonDto => {
				const teacherEntity = await this.teacherRepository.findOne({
					where: { id: lessonDto.teacher.id }
				})

				const disciplineEntity = await this.disciplineRepository.findOne({
					where: { id: lessonDto.discipline.id }
				})

				if (!teacherEntity) {
					throw new NotFoundException(
						`Teacher with ID ${lessonDto.teacherId} not found`
					)
				}

				if (!disciplineEntity) {
					throw new NotFoundException(
						`Discipline with ID ${lessonDto.discipline} not found`
					)
				}

				return {
					...lessonDto,
					discipline: disciplineEntity,
					teacher: teacherEntity
				} as Lesson
			})
		)
	}
}
