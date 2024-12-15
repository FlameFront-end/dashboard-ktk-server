import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { IUser } from '../types/types'
import { InjectRepository } from '@nestjs/typeorm'
import { TeacherEntity } from '../teachers/entities/teacher.entity'
import { Repository } from 'typeorm'
import { StudentEntity } from '../students/entities/student.entity'
import { AdminEntity } from '../admins/entities/admin.entity'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(TeacherEntity)
		private readonly teacherRepository: Repository<TeacherEntity>,

		@InjectRepository(StudentEntity)
		private readonly studentRepository: Repository<StudentEntity>,

		@InjectRepository(AdminEntity)
		private readonly adminRepository: Repository<AdminEntity>,

		private readonly jwtService: JwtService
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.findOneByEmail(email)
		const passwordIsMatch = await argon2.verify(user.password, password)

		if (user && passwordIsMatch) {
			return user
		}

		throw new UnauthorizedException('Неверная почта или пароль!')
	}

	async login(user: IUser) {
		const { id, email, name, role, group } = user

		return {
			id,
			name,
			role,
			email,
			groupId: group?.id ?? null,
			token: this.jwtService.sign({ id: user.id, email: user.email })
		}
	}

	async findOneByEmail(email: string) {
		const [admin, teacher, student] = await Promise.all([
			this.adminRepository.findOne({ where: { email } }),
			this.teacherRepository.findOne({
				where: { email },
				relations: ['group']
			}),
			this.studentRepository.findOne({ where: { email }, relations: ['group'] })
		])

		return admin || teacher || student
	}

	async findOneById(id: string) {
		const [admin, teacher, student] = await Promise.all([
			this.adminRepository.findOne({ where: { id } }),
			this.teacherRepository.findOne({
				where: { id }
			}),
			this.studentRepository.findOne({ where: { id } })
		])

		return admin || teacher || student
	}
}
