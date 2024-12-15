import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MessagesService } from './messages.service'

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Get('/:chatId')
	async getChatMessagesById(@Param('chatId') chatId: string) {
		return await this.messagesService.getAllMessages(chatId)
	}
}
