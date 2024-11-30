import { Body, Controller, Post } from '@nestjs/common'
import { MailService } from './mail.service'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { SendEmailDto } from './dto/send-email.dto'

@ApiTags('mail')
@Controller('mail')
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@Post('send')
	@ApiBody({ type: SendEmailDto })
	async sendMail(@Body() sendEmailDto: SendEmailDto) {
		return this.mailService.sendMail(sendEmailDto)
	}
}
