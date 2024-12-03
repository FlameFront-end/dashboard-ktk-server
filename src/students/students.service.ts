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

@Injectable()
export class StudentsService {
	constructor(
		@InjectRepository(StudentEntity)
		private readonly studentRepository: Repository<StudentEntity>,

		private readonly mailService: MailService,

		private readonly authService: AuthService
	) {}

	async create(createStudentDto: CreateStudentDto) {
		const existUser = await this.authService.findOneByEmail(
			createStudentDto.email
		)

		if (existUser) {
			throw new ConflictException('User with this email already exists')
		}

		const password = generatePassword()
		const hashedPassword = await argon2.hash(password)

		const student = this.studentRepository.create({
			...createStudentDto,
			password: hashedPassword
		})

		await this.mailService.sendMail({
			to: createStudentDto.email,
			text: `Логин: ${createStudentDto.email}, пароль: ${password}`,
			subject: 'Данные для входа в КТК'
		})

		return await this.studentRepository.save(student)
	}

	async findAll() {
		return this.studentRepository.find({ relations: ['group'] })
	}

	async findWithoutGroup(): Promise<StudentEntity[]> {
		return this.studentRepository.find({
			where: { group: null }
		})
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
		const student = await this.studentRepository.findOne({ where: { id } })
		if (!student) {
			throw new NotFoundException(`Student with ID ${id} not found`)
		}
		Object.assign(student, updateStudentDto)
		return this.studentRepository.save(student)
	}

	async delete(id: string): Promise<DeleteResult> {
		return await this.studentRepository.delete(id)
	}
}
