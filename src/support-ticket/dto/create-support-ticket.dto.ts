import { IsEnum, IsString, IsUUID } from 'class-validator'
import { TicketUserType } from '../entities/support-ticket.entity'

export class CreateSupportTicketDto {
	@IsUUID()
	userId: string

	@IsEnum(['student', 'teacher', 'admin'])
	userType: TicketUserType

	@IsString()
	message: string
}
