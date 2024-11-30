import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StudentEntity } from './entities/student.entity'
import { UpdateStudentDto } from './dto/update-student.dto'
import { UserEntity } from '../user/entities/user.entity'
import * as argon2 from 'argon2'
import { MailService } from '../mail/mail.service'

@Injectable()
export class StudentsService {
	constructor(
		@InjectRepository(StudentEntity)
		private readonly studentRepository: Repository<StudentEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,

		private readonly mailService: MailService
	) {}

	async create(createStudentDto: CreateStudentDto) {
		const password =
			Math.random().toString(36).substring(2, 10) +
			Math.random().toString(36).substring(2, 10)
		const passwordHash = await argon2.hash(password)

		const student = this.studentRepository.create(createStudentDto)
		const savedStudent = await this.studentRepository.save(student)

		const user = this.userRepository.create({
			username: createStudentDto.email,
			password: passwordHash,
			student: savedStudent,
			email: savedStudent.email,
			isAdmin: false,
			birthdate: savedStudent.birthDate
		})

		await this.mailService.sendMail({
			to: createStudentDto.email,
			text: `Логин: ${createStudentDto.email}, пароль: ${password}`,
			subject: 'Данные для входа в КТК'
		})

		await this.userRepository.save(user)

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
