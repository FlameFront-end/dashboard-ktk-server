import { Injectable } from '@nestjs/common'
import { ChatGateway } from './chat.gateway'
import { InjectRepository } from '@nestjs/typeorm'
import { ChatEntity } from './entities/chat.entity'
import { Repository } from 'typeorm'
import {
	MessageEntity,
	SenderMessage
} from '../messages/entities/message.entity'

@Injectable()
export class ChatService {
	constructor(
		private chatGateway: ChatGateway,
		@InjectRepository(ChatEntity)
		private chatRepository: Repository<ChatEntity>
	) {}

	async broadcastParticipantUpdate(
		textMessage: string,
		chatId: string,
		sender: SenderMessage
	) {
		const chat = await this.chatRepository.findOne({ where: { id: chatId } })

		const message: MessageEntity = {
			id: sender.id,
			senderType: 'system',
			sender,
			chat,
			text: textMessage,
			createdAt: new Date()
		}

		this.chatGateway.broadcastParticipantUpdate(chatId, message)
	}

	async getChatByGroupId(groupId: string): Promise<ChatEntity> {
		return await this.chatRepository.findOne({
			where: {
				groupId
			},
			relations: ['messages']
		})
	}
}
