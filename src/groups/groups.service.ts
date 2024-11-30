import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateGroupDto, LessonDto } from './dto/create-group.dto'
import { GroupEntity } from './entities/group.entity'
import { Lesson, ScheduleEntity } from './entities/schedule.entity'
import { TeacherEntity } from '../teachers/entities/teacher.entity'
import { StudentEntity } from '../students/entities/student.entity'

@Injectable()
export class GroupsService {
	constructor(
		@InjectRepository(GroupEntity)
		private readonly groupRepository: Repository<GroupEntity>,

		@InjectRepository(ScheduleEntity)
		private readonly scheduleRepository: Repository<ScheduleEntity>,

		@InjectRepository(TeacherEntity)
		private readonly teacherRepository: Repository<TeacherEntity>,

		@InjectRepository(StudentEntity)
		private readonly studentRepository: Repository<StudentEntity>
	) {}

	async create(createGroupDto: CreateGroupDto): Promise<GroupEntity> {
		const { name, teacher, students, schedule } = createGroupDto

		const teacherEntity = await this.teacherRepository.findOne({
			where: {
				id: teacher
			}
		})

		if (!teacherEntity) {
			throw new NotFoundException('Teacher not found')
		}

		const studentEntities = await this.studentRepository.findByIds(students)

		if (students.length !== studentEntities.length) {
			throw new NotFoundException('One or more students not found')
		}

		const group = this.groupRepository.create({
			name,
			teacher: teacherEntity,
			students: studentEntities
		})

		const savedGroup = await this.groupRepository.save(group)

		const resSchedule = this.scheduleRepository.create({
			monday: await this.processLessons(schedule.monday),
			tuesday: await this.processLessons(schedule.tuesday),
			wednesday: await this.processLessons(schedule.wednesday),
			thursday: await this.processLessons(schedule.thursday),
			friday: await this.processLessons(schedule.friday),
			group: savedGroup
		})

		savedGroup.schedule = await this.scheduleRepository.save(resSchedule)

		return await this.groupRepository.save(savedGroup)
	}

	async findAll(): Promise<GroupEntity[]> {
		return await this.groupRepository.find({
			relations: ['schedule', 'teacher', 'students']
		})
	}

	async findOne(id: string): Promise<GroupEntity> {
		const group = await this.groupRepository.findOne({
			where: { id },
			relations: ['schedule', 'teacher', 'students']
		})

		if (!group) {
			throw new NotFoundException('Group not found')
		}

		return group
	}

	async remove(id: string): Promise<void> {
		const group = await this.groupRepository.findOne({
			where: { id },
			relations: ['schedule']
		})

		if (!group) {
			throw new NotFoundException('Group not found')
		}

		if (group.schedule) {
			await this.scheduleRepository.delete(group.schedule.id)
		}

		await this.groupRepository.delete(id)
	}

	private async processLessons(lessons: LessonDto[]): Promise<Lesson[]> {
		return Promise.all(
			lessons.map(async lessonDto => {
				const teacherEntity = await this.teacherRepository.findOne({
					where: { id: lessonDto.teacher }
				})

				if (!teacherEntity) {
					throw new NotFoundException(
						`Teacher with ID ${lessonDto.teacher} not found`
					)
				}

				return {
					...lessonDto,
					teacher: teacherEntity
				} as Lesson
			})
		)
	}
}
