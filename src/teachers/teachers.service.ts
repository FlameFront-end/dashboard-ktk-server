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
import { DisciplineEntity } from '../disciplines/entities/discipline.entity'
import * as argon2 from 'argon2'
import { GroupEntity } from '../groups/entities/group.entity'

@Injectable()
export class TeachersService {
	constructor(
		@InjectRepository(TeacherEntity)
		private readonly teacherRepository: Repository<TeacherEntity>,

		@InjectRepository(DisciplineEntity)
		private readonly disciplineRepository: Repository<DisciplineEntity>,

		@InjectRepository(GroupEntity)
		private readonly groupRepository: Repository<GroupEntity>,

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

		const discipline = await this.disciplineRepository.findOne({
			where: {
				id: createTeacherDto.discipline
			}
		})

		const group = await this.groupRepository.findOne({
			where: {
				id: createTeacherDto.groupId
			}
		})

		console.log('discipline', discipline)

		const teacher = this.teacherRepository.create({
			name: createTeacherDto.name,
			email: createTeacherDto.email,
			password: hashedPassword,
			group,
			discipline
		})

		await this.mailService.sendMail({
			to: createTeacherDto.email,
			text: `Логин: ${createTeacherDto.email}, пароль: ${password}`,
			subject: 'Данные для входа в КТК'
		})

		return await this.teacherRepository.save(teacher)
	}

	async getAllTeachers(): Promise<TeacherEntity[]> {
		return this.teacherRepository.find({ relations: ['group', 'discipline'] })
	}

	async getTeacherById(id: string): Promise<TeacherEntity> {
		const teacher = await this.teacherRepository.findOne({
			where: { id },
			relations: ['group', 'discipline']
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
