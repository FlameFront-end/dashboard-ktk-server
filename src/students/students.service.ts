import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { StudentEntity } from './entities/student.entity'
import { UpdateStudentDto } from './dto/update-student.dto'
import { MailService } from '../mail/mail.service'
import { generatePassword } from '../utils/generatePassword'
import { AuthService } from '../auth/auth.service'
import * as argon2 from 'argon2'
import { ChatEntity } from '../chat/entities/chat.entity'
import { ChatService } from '../chat/chat.service'
import { GradeEntity } from '../groups/entities/grade.entity'
import { MessagesService } from '../messages/messages.service'
import { GroupsService } from '../groups/groups.service'

@Injectable()
export class StudentsService {
	constructor(
		private readonly mailService: MailService,
		private readonly authService: AuthService,
		private readonly chatService: ChatService,
		private readonly messagesService: MessagesService,
		private readonly groupsService: GroupsService,

		@InjectRepository(StudentEntity)
		private readonly studentRepository: Repository<StudentEntity>,

		@InjectRepository(ChatEntity)
		private chatRepository: Repository<ChatEntity>,

		@InjectRepository(GradeEntity)
		private gradeRepository: Repository<GradeEntity>
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

	async create(createStudentDto: CreateStudentDto) {
		const existUser = await this.authService.findOneByEmail(
			createStudentDto.email
		)

		if (existUser) {
			throw new ConflictException('User with this email already exists')
		}

		const password = generatePassword()
		const hashedPassword = await argon2.hash(password)

		const group = await this.groupsService.findOne(createStudentDto.groupId)

		const student = this.studentRepository.create({
			...createStudentDto,
			group,
			password: hashedPassword
		})

		await this.mailService.sendMail({
			to: createStudentDto.email,
			text: `Логин: ${createStudentDto.email}, пароль: ${password}`,
			subject: 'Данные для входа в КТК'
		})

		const savedStudent = await this.studentRepository.save(student)

		if (savedStudent.group.id) {
			const chat = await this.chatRepository.findOneBy({
				groupId: savedStudent.group.id
			})

			if (chat) {
				await this.sendGroupChangeMessage(
					student,
					`👋 Новый студент ${student.name} присоединился к группе.`,
					chat.id
				)
			}
		}

		return savedStudent
	}

	async findAll() {
		return this.studentRepository.find({ relations: ['group'] })
	}

	async findWithoutGroup(): Promise<StudentEntity[]> {
		return this.studentRepository
			.createQueryBuilder('student')
			.leftJoinAndSelect('student.group', 'group')
			.where('group.id IS NULL')
			.getMany()
	}

	async findOne(id: string) {
		const student = await this.studentRepository.findOne({
			where: { id },
			relations: ['group']
		})
		if (!student) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}
		return student
	}

	async update(id: string, updateStudentDto: UpdateStudentDto) {
		const student = await this.studentRepository.findOne({
			where: { id },
			relations: ['group', 'group.chat']
		})

		if (!student) {
			throw new NotFoundException(`Student with ID ${id} not found`)
		}

		const oldGroup = student.group

		// Если у студента нет группы, присваиваем новую
		if (!oldGroup) {
			student.group = await this.groupsService.findOne(updateStudentDto.groupId)
			if (!student.group) {
				throw new NotFoundException(
					`Group with ID ${updateStudentDto.groupId} not found`
				)
			}
		}

		const newGroup = await this.groupsService.findOne(updateStudentDto.groupId)

		if (!newGroup) {
			throw new NotFoundException(
				`Group with ID ${updateStudentDto.groupId} not found`
			)
		}

		student.group = newGroup
		Object.assign(student, updateStudentDto)

		await this.studentRepository.save(student)

		// Отправка сообщений, если группа изменена или если у студента не было группы
		if (oldGroup) {
			// Если группа изменилась, отправляем сообщение о покидании старой группы
			if (oldGroup.id !== newGroup.id && oldGroup.chat) {
				await this.sendGroupChangeMessage(
					student,
					`👋 Студент ${student.name} покинул группу.`,
					oldGroup.chat.id
				)
			}
		}

		// Отправка сообщения в новую группу, что студент присоединился
		if (newGroup.chat) {
			await this.sendGroupChangeMessage(
				student,
				`👋 Новый студент ${student.name} присоединился к группе.`,
				newGroup.chat.id
			)
		}

		return student
	}

	async delete(id: string): Promise<DeleteResult> {
		const student = await this.studentRepository.findOne({
			where: { id },
			relations: ['group', 'group.chat']
		})

		if (!student) {
			throw new NotFoundException(`Student with ID ${id} not found`)
		}

		const group = student.group

		const result = await this.studentRepository.delete(id)

		if (group && group.chat) {
			await this.sendGroupChangeMessage(
				student,
				`👋 Студент ${student.name} покинул группу.`,
				group.chat.id
			)
		}

		return result
	}

	async removeFromGroup(studentId: string): Promise<StudentEntity> {
		const student = await this.studentRepository.findOne({
			where: { id: studentId },
			relations: ['group', 'group.chat']
		})

		if (!student) {
			throw new NotFoundException(`Student with ID ${studentId} not found`)
		}

		await this.sendGroupChangeMessage(
			student,
			`👋 Студент ${student.name} покинул группу.`,
			student.group.chat.id
		)

		student.group = null
		return this.studentRepository.save(student)
	}

	async getStudentGradesGroupedByDisciplines(studentId: string): Promise<
		{
			discipline: string
			grades: { id: string; grade: string; date: Date }[]
		}[]
	> {
		const grades = await this.gradeRepository
			.createQueryBuilder('grade')
			.leftJoinAndSelect('grade.discipline', 'discipline')
			.leftJoinAndSelect('grade.student', 'student')
			.where('student.id = :studentId', { studentId })
			.select(['grade.id', 'grade.grade', 'grade.date', 'discipline.name'])
			.getMany()

		if (!grades.length) {
			throw new NotFoundException(
				`Grades for student with ID ${studentId} not found`
			)
		}

		const groupedByDiscipline = grades.reduce(
			(acc, grade) => {
				const disciplineName = grade.discipline.name
				if (!acc[disciplineName]) {
					acc[disciplineName] = []
				}
				acc[disciplineName].push({
					id: grade.id,
					grade: grade.grade,
					date: grade.date
				})
				return acc
			},
			{} as {
				[discipline: string]: { id: string; grade: string; date: Date }[]
			}
		)

		return Object.entries(groupedByDiscipline).map(([discipline, grades]) => ({
			discipline,
			grades
		}))
	}
}
