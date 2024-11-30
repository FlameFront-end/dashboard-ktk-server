import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { TeacherEntity } from './entities/teacher.entity'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import * as argon2 from 'argon2'
import { UserEntity } from '../user/entities/user.entity'
import { MailService } from '../mail/mail.service'
import { UserService } from '../user/user.service'
import { generatePassword } from '../utils/generatePassword'

@Injectable()
export class TeachersService {
	constructor(
		@InjectRepository(TeacherEntity)
		private readonly teacherRepository: Repository<TeacherEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,

		private readonly mailService: MailService,
		private readonly userService: UserService
	) {}

	async createTeacher(
		createTeacherDto: CreateTeacherDto
	): Promise<TeacherEntity> {
		const password = generatePassword()

		const teacher = this.teacherRepository.create(createTeacherDto)
		const savedTeacher = await this.teacherRepository.save(teacher)

		await this.userService
			.create({
				username: createTeacherDto.name,
				password,
				teacher: savedTeacher,
				email: createTeacherDto.email,
				isTeacher: true
			})
			.then(() => {
				this.mailService.sendMail({
					to: createTeacherDto.email,
					text: `Логин: ${createTeacherDto.email}, пароль: ${password}`,
					subject: 'Данные для входа в КТК'
				})
			})

		return savedTeacher
	}

	async getAllTeachers(): Promise<TeacherEntity[]> {
		return this.teacherRepository.find()
	}

	async getTeacherById(id: string): Promise<TeacherEntity> {
		const teacher = await this.teacherRepository.findOne({ where: { id } })
		if (!teacher) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}
		return teacher
	}

	async update(id: string, updateTeacherDto: UpdateTeacherDto) {
		const teacher = await this.teacherRepository.findOne({ where: { id } })
		if (!teacher) {
			throw new NotFoundException(`Student with ID ${id} not found`)
		}
		Object.assign(teacher, updateTeacherDto)
		return this.teacherRepository.save(teacher)
	}

	async deleteTeacherById(id: string): Promise<void> {
		const teacher = await this.teacherRepository.findOne({
			where: { id },
			relations: ['user']
		})

		if (!teacher) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}

		if (teacher.user) {
			await this.userRepository.remove(teacher.user)
		}

		await this.teacherRepository.delete(id)
	}
}
