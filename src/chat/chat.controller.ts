import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChatService } from './chat.service'

@ApiTags('chat')
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get('/:groupId')
	async getChatByGroupId(@Param('groupId') groupId: string) {
		return await this.chatService.getChatByGroupId(groupId)
	}
}
