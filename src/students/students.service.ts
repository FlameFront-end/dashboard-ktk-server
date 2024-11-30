import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StudentEntity } from './entities/student.entity'
import { UpdateStudentDto } from './dto/update-student.dto'
import { UserEntity } from '../user/entities/user.entity'
import * as argon2 from 'argon2'

@Injectable()
export class StudentsService {
	constructor(
		@InjectRepository(StudentEntity)
		private readonly studentRepository: Repository<StudentEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async create(createStudentDto: CreateStudentDto) {
		const username =
			createStudentDto.email ||
			createStudentDto.name.toLowerCase().replace(' ', '_')
		const password =
			Math.random().toString(36).substring(2, 10) +
			Math.random().toString(36).substring(2, 10)
		const passwordHash = await argon2.hash(password)

		const student = this.studentRepository.create(createStudentDto)
		const savedStudent = await this.studentRepository.save(student)

		const user = this.userRepository.create({
			username,
			password: passwordHash,
			student: savedStudent,
			email: savedStudent.email,
			isAdmin: false,
			birthdate: savedStudent.birthDate
		})

		await this.userRepository.save(user)

		console.log('Сгенерированный пароль:', password)

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

	async delete(id: string) {
		const student = await this.studentRepository.delete(id)
		if (student.affected === 0) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}
	}
}
