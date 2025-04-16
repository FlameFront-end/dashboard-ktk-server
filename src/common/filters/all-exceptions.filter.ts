import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'
import { TelegramService } from 'src/telegram/telegram.service'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly telegramService: TelegramService) {}

	async catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<Request>()

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR

		const message =
			exception instanceof HttpException ? exception.message : String(exception)

		const errorText = `
				🚨 Ошибка на сервере
				🕐 Время: ${new Date().toLocaleString()}
				📦 URL: ${request.method} ${request.url}
				📄 Статус: ${status}
				🧾 Сообщение: ${message}
    `

		try {
			await this.telegramService.sendMessage(errorText, true)
		} catch (err) {
			console.error('Ошибка при отправке в Telegram:', err)
		}

		response.status(status).json({
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
			path: request.url
		})
	}
}
