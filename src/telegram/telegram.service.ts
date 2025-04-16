import { Injectable } from '@nestjs/common'
import { Telegraf } from 'telegraf'

@Injectable()
export class TelegramService {
	private readonly supportBot: Telegraf
	private readonly loggerBot: Telegraf
	private chatId = '2130983218'

	constructor() {
		this.supportBot = new Telegraf(process.env.TELEGRAM_SUPPORT_BOT_TOKEN)
		this.loggerBot = new Telegraf(process.env.TELEGRAM_LOGGER_BOT_TOKEN)
	}

	async sendMessage(message: string, isLogger = false) {
		try {
			const bot = isLogger ? this.loggerBot : this.supportBot
			await bot.telegram.sendMessage(this.chatId, message)
		} catch (error) {
			console.error('Error while sending message to Telegram:', error)
			throw new Error('Failed to send message to Telegram')
		}
	}
}
