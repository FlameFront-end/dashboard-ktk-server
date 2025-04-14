import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateMessageDto {
	@IsString()
	@IsNotEmpty()
	senderId: string

	@IsString()
	@IsNotEmpty()
	text: string

	@IsUUID()
	@IsNotEmpty()
	chatId: string

	@IsUUID()
	@IsNotEmpty()
	userId: string

	@IsString()
	senderType: 'student' | 'teacher' | 'system'
}
