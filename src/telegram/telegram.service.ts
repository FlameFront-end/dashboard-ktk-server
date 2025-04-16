import { Injectable } from '@nestjs/common'
import { Telegraf } from 'telegraf'

@Injectable()
export class TelegramService {
	private bot: Telegraf

	constructor() {
		this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
	}

	async sendMessage(message: string) {
		try {
			await this.bot.telegram.sendMessage('2130983218', message)
		} catch (error) {
			console.error('Error while sending message to Telegram:', error)
			throw new Error('Failed to send message to Telegram')
		}
	}
}
