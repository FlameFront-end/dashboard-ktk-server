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
import { MessagesService } from '../messages/messages.service'
import { ChatService } from '../chat/chat.service'

export interface GradeData {
	[studentId: string]: string
}

export interface DisciplineGrades {
	[date: string]: GradeData
}

@Injectable()
export class GroupsService {
	constructor(
		private readonly chatService: ChatService,

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
		private readonly chatRepository: Repository<ChatEntity>,

		private readonly messagesService: MessagesService
	) {}

	async sendGroupChangeMessage(student: any, message: string, chatId: string) {
		this.chatService.broadcastParticipantUpdate(message, chatId, {
			id: student.id,
			name: 'Системное оповещание',
			phone: student.phone,
			email: student.email
		})

		await this.messagesService.create({
			text: message,
			chatId: chatId,
			senderId: 'system',
			senderType: 'system',
			userId: null
		})
	}

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

		// Сохраняем расписание
		await this.scheduleRepository.save(scheduleEntity)
		group.schedule = scheduleEntity

		// Сохраняем группу (без чата пока)
		const savedGroup = await this.groupRepository.save(group)

		// Создаём чат
		const chat = this.chatRepository.create({ groupId: savedGroup.id })
		const savedChat = await this.chatRepository.save(chat)

		// Обновляем группу с чатом
		savedGroup.chat = savedChat
		await this.groupRepository.save(savedGroup)

		// Обновляем учителя, связываем с группой
		await this.teacherRepository.update(teacherId, { group: savedGroup })

		await this.messagesService.create({
			text: `Группа "${savedGroup.name}" создана. Участники добавлены в чат.`,
			chatId: savedChat.id,
			senderId: null,
			senderType: 'system',
			userId: null
		})

		return savedGroup
	}

	async update(
		id: string,
		updateGroupDto: UpdateGroupDto
	): Promise<GroupEntity> {
		const group = await this.groupRepository.findOne({
			where: { id },
			relations: ['schedule', 'teacher', 'students', 'chat']
		})

		if (!group) {
			throw new NotFoundException('Group not found')
		}

		const { name, teacher, students, schedule } = updateGroupDto

		// Handle the new teacher
		let newTeacher
		if (teacher) {
			newTeacher = await this.teacherRepository.findOne({
				where: { id: teacher }
			})
			if (!newTeacher) {
				throw new NotFoundException(`Teacher with ID ${teacher} not found`)
			}

			if (group.teacher?.id !== newTeacher.id) {
				group.teacher = newTeacher
			}
		}

		if (group.chat && schedule) {
			const daysOfWeek = [
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday'
			]

			for (const day of daysOfWeek) {
				const oldDaySchedule = group.schedule[day] || []
				const newDaySchedule = schedule[day] || []

				const oldByTeacher = new Map<string, typeof oldDaySchedule>()
				const newByTeacher = new Map<string, typeof newDaySchedule>()

				// Группируем старое расписание по учителям
				for (const lesson of oldDaySchedule) {
					if (!lesson.teacher) continue
					const list = oldByTeacher.get(lesson.teacher.id) || []
					oldByTeacher.set(lesson.teacher.id, [...list, lesson])
				}

				// Группируем новое расписание по учителям
				for (const lesson of newDaySchedule) {
					if (!lesson.teacher) continue
					const list = newByTeacher.get(lesson.teacher.id) || []
					newByTeacher.set(lesson.teacher.id, [...list, lesson])
				}

				// ✅ Изменение дисциплины у того же учителя
				for (const [teacherId, oldLessons] of oldByTeacher) {
					const newLessons = newByTeacher.get(teacherId)

					if (newLessons) {
						const oldDisciplines = oldLessons.map(l => l.discipline.id)
						const newDisciplines = newLessons.map(l => l.discipline.id)

						const removed = oldLessons.find(
							l => !newDisciplines.includes(l.discipline.id)
						)
						const added = newLessons.find(
							l => !oldDisciplines.includes(l.discipline.id)
						)

						if (removed && added) {
							await this.sendGroupChangeMessage(
								removed.teacher,
								`👨‍🏫 Учитель ${removed.teacher.name} больше не ведет дисциплину ${removed.discipline.name}, теперь ведет ${added.discipline.name}.`,
								group.chat.id
							)
						}
					}
				}

				// ✅ Изменение преподавателя у той же дисциплины
				for (const oldLesson of oldDaySchedule) {
					const newLesson = newDaySchedule.find(
						l =>
							l.discipline.id === oldLesson.discipline.id &&
							l.teacher?.id !== oldLesson.teacher?.id
					)

					if (newLesson && oldLesson.teacher && newLesson.teacher) {
						await this.sendGroupChangeMessage(
							newLesson.teacher,
							`👨‍🏫 У дисциплины ${newLesson.discipline.name} сменился преподаватель: был ${oldLesson.teacher.name}, стал ${newLesson.teacher.name}.`,
							group.chat.id
						)
					}
				}

				// 👋 Преподаватели, полностью ушедшие
				for (const [teacherId, oldLessons] of oldByTeacher) {
					if (!newByTeacher.has(teacherId)) {
						for (const lesson of oldLessons) {
							await this.sendGroupChangeMessage(
								lesson.teacher,
								`👋 Учитель ${lesson.teacher.name} больше не ведет лекцию по дисциплине ${lesson.discipline.name}.`,
								group.chat.id
							)
						}
					}
				}

				// 👋 Преподаватели, полностью новые
				for (const [teacherId, newLessons] of newByTeacher) {
					if (!oldByTeacher.has(teacherId)) {
						for (const lesson of newLessons) {
							await this.sendGroupChangeMessage(
								lesson.teacher,
								`👋 Новый учитель ${lesson.teacher.name} присоединился к группе по дисциплине ${lesson.discipline.name}.`,
								group.chat.id
							)
						}
					}
				}
			}
		}

		// Обновление студентов
		if (students) {
			group.students = await this.studentRepository.findByIds(students)
		}

		if (name) {
			group.name = name
		}

		// Обновление расписания
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
