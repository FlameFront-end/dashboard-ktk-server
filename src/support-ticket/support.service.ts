import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SupportTicketEntity } from './entities/support-ticket.entity'
import { StudentEntity } from '../students/entities/student.entity'
import { TeacherEntity } from '../teachers/entities/teacher.entity'
import { AdminEntity } from '../admins/entities/admin.entity'
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto'
import { TelegramService } from '../telegram/telegram.service'

@Injectable()
export class SupportService {
	constructor(
		@InjectRepository(SupportTicketEntity)
		private ticketRepo: Repository<SupportTicketEntity>,
		@InjectRepository(StudentEntity)
		private studentRepo: Repository<StudentEntity>,
		@InjectRepository(TeacherEntity)
		private teacherRepo: Repository<TeacherEntity>,
		@InjectRepository(AdminEntity)
		private adminRepo: Repository<AdminEntity>,
		private telegramService: TelegramService
	) {}

	async createTicket(dto: CreateSupportTicketDto) {
		const { userId, userType, message } = dto

		const ticket = new SupportTicketEntity()
		ticket.message = message
		ticket.status = 'open'
		ticket.userType = userType

		let senderName = ''

		switch (userType) {
			case 'student':
				const student = await this.studentRepo.findOne({
					where: { id: userId }
				})
				if (!student) throw new NotFoundException('Студент не найден')
				ticket.student = student
				senderName = student.name
				break
			case 'teacher':
				const teacher = await this.teacherRepo.findOne({
					where: { id: userId }
				})
				if (!teacher) throw new NotFoundException('Учитель не найден')
				ticket.teacher = teacher
				senderName = teacher.name
				break
			case 'admin':
				const admin = await this.adminRepo.findOne({ where: { id: userId } })
				if (!admin) throw new NotFoundException('Админ не найден')
				ticket.admin = admin
				senderName = admin.name
				break
		}

		await this.telegramService.sendMessage(
			`🆘 Новый тикет от ${senderName}:\n\n${message}`
		)

		return await this.ticketRepo.save(ticket)
	}

	async getAllTickets() {
		return await this.ticketRepo.find({
			order: { createdAt: 'DESC' }
		})
	}

	getError() {
		throw new Error('💥 Искусственная ошибка для теста')
	}
}
