import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { SendEmailDto } from './dto/send-email.dto'

@Injectable()
export class MailService {
	private transporter: nodemailer.Transporter

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS
			}
		})
	}

	async sendMail(sendEmailDto: SendEmailDto) {
		const { to, subject, text, html } = sendEmailDto
		const mailOptions = {
			from: '"Артём Калиганов" <flame.kaliganov@gmail.com>',
			to,
			subject,
			text,
			html
		}

		try {
			return await this.transporter.sendMail(mailOptions)
		} catch (error) {
			console.error('Error sending email: ', error)
			throw error
		}
	}
}
