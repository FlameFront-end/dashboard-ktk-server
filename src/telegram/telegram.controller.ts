import { Body, Controller, Post } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateMessageDto } from './dto/create-message.dto'

@ApiTags('telegram')
@Controller('telegram')
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) {}

	@Post('/send-message')
	async sendMessage(@Body() createMessageDto: CreateMessageDto) {
		return await this.telegramService.sendMessage(createMessageDto.message)
	}
}
