import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { generatePassword } from '../utils/generatePassword'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { MailService } from '../mail/mail.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { AdminEntity } from './entities/admin.entity'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { AuthService } from '../auth/auth.service'
import * as argon2 from 'argon2'

@Injectable()
export class AdminsService {
	constructor(
		@InjectRepository(AdminEntity)
		private readonly adminRepository: Repository<AdminEntity>,

		private readonly mailService: MailService,

		private readonly authService: AuthService
	) {}
	async create(createAdminDto: CreateAdminDto) {
		const existUser = await this.authService.findOneByEmail(
			createAdminDto.email
		)

		if (existUser) {
			throw new ConflictException('User with this email already exists')
		}

		const password = generatePassword()
		const hashedPassword = await argon2.hash(password)

		const admin = this.adminRepository.create({
			...createAdminDto,
			password: hashedPassword
		})

		await this.mailService.sendMail({
			to: createAdminDto.email,
			text: `Логин: ${createAdminDto.email}, пароль: ${password}`,
			subject: 'Данные для входа в КТК'
		})

		return await this.adminRepository.save(admin)
	}

	async findAll() {
		return this.adminRepository.find()
	}

	async findOne(id: string) {
		const student = await this.adminRepository.findOne({ where: { id } })
		if (!student) {
			throw new NotFoundException(`Admin with ID ${id} not found`)
		}
		return student
	}

	async update(id: string, updateAdminDto: UpdateAdminDto) {
		const student = await this.adminRepository.findOne({ where: { id } })
		if (!student) {
			throw new NotFoundException(`Admin with ID ${id} not found`)
		}
		Object.assign(student, updateAdminDto)
		return this.adminRepository.save(student)
	}

	async delete(id: string): Promise<DeleteResult> {
		return await this.adminRepository.delete(id)
	}
}
