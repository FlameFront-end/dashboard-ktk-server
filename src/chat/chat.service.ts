import { Injectable } from '@nestjs/common'
import { ChatGateway } from './chat.gateway'

@Injectable()
export class ChatService {
	constructor(private chatGateway: ChatGateway) {}

	emit(event: string, data: any) {
		this.chatGateway.emit(event, data)
	}
}
