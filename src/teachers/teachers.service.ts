import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { TeacherEntity } from './entities/teacher.entity'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import { MailService } from '../mail/mail.service'
import { generatePassword } from '../utils/generatePassword'
import { AuthService } from '../auth/auth.service'
import * as argon2 from 'argon2'

@Injectable()
export class TeachersService {
	constructor(
		@InjectRepository(TeacherEntity)
		private readonly teacherRepository: Repository<TeacherEntity>,

		private readonly mailService: MailService,

		private readonly authService: AuthService
	) {}

	async createTeacher(createTeacherDto: CreateTeacherDto) {
		const existUser = await this.authService.findOneByEmail(
			createTeacherDto.email
		)

		if (existUser) {
			throw new ConflictException('User with this email already exists')
		}

		const password = generatePassword()
		const hashedPassword = await argon2.hash(password)

		const teacher = this.teacherRepository.create({
			...createTeacherDto,
			password: hashedPassword
		})

		await this.mailService.sendMail({
			to: createTeacherDto.email,
			text: `Логин: ${createTeacherDto.email}, пароль: ${password}`,
			subject: 'Данные для входа в КТК'
		})

		return await this.teacherRepository.save(teacher)
	}

	async getAllTeachers(): Promise<TeacherEntity[]> {
		return this.teacherRepository.find({ relations: ['group'] })
	}

	async getTeacherById(id: string): Promise<TeacherEntity> {
		const teacher = await this.teacherRepository.findOne({
			where: { id },
			relations: ['group']
		})
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

	async deleteTeacherById(id: string): Promise<DeleteResult> {
		return await this.teacherRepository.delete(id)
	}
}
