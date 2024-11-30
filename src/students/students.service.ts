import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StudentEntity } from './entities/student.entity'
import { UpdateStudentDto } from './dto/update-student.dto'
import { UserEntity } from '../user/entities/user.entity'
import { MailService } from '../mail/mail.service'
import { UserService } from '../user/user.service'
import { generatePassword } from '../utils/generatePassword'

@Injectable()
export class StudentsService {
	constructor(
		@InjectRepository(StudentEntity)
		private readonly studentRepository: Repository<StudentEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,

		private readonly mailService: MailService,

		private readonly userService: UserService
	) {}

	async create(createStudentDto: CreateStudentDto) {
		const password = generatePassword()

		const student = this.studentRepository.create(createStudentDto)
		const savedStudent = await this.studentRepository.save(student)

		await this.userService
			.create({
				username: createStudentDto.name,
				password,
				student: savedStudent,
				email: createStudentDto.email,
				birthdate: createStudentDto.birthDate,
				isStudent: true
			})
			.then(() => {
				this.mailService.sendMail({
					to: createStudentDto.email,
					text: `Логин: ${createStudentDto.email}, пароль: ${password}`,
					subject: 'Данные для входа в КТК'
				})
			})

		return savedStudent
	}

	async findAll() {
		return this.studentRepository.find()
	}

	async findOne(id: string) {
		const student = await this.studentRepository.findOne({ where: { id } })
		if (!student) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}
		return student
	}

	async update(id: string, updateStudentDto: UpdateStudentDto) {
		const student = await this.studentRepository.findOne({ where: { id } })
		if (!student) {
			throw new NotFoundException(`Student with ID ${id} not found`)
		}
		Object.assign(student, updateStudentDto)
		return this.studentRepository.save(student)
	}

	async delete(id: string): Promise<void> {
		const student = await this.studentRepository.findOne({
			where: { id },
			relations: ['user']
		})

		if (!student) {
			throw new NotFoundException(`Student with ID ${id} not found`)
		}

		if (student.user) {
			await this.userRepository.remove(student.user)
		}

		await this.studentRepository.delete(id)
	}
}
