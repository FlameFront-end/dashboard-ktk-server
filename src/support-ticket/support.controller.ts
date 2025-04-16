import { Controller, Post, Body, Get } from '@nestjs/common'
import { SupportService } from './support.service'
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto'
import { ApiTags } from '@nestjs/swagger'

@Controller('support')
@ApiTags('support')
export class SupportController {
	constructor(private readonly supportService: SupportService) {}

	@Post('ticket')
	create(@Body() dto: CreateSupportTicketDto) {
		return this.supportService.createTicket(dto)
	}

	@Get('tickets')
	getAll() {
		return this.supportService.getAllTickets()
	}

	@Get('error')
	getError() {
		return this.supportService.getError()
	}
}
