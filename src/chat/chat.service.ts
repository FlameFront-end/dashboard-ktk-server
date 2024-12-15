import { Injectable } from '@nestjs/common'
import { ChatGateway } from './chat.gateway'
import { InjectRepository } from '@nestjs/typeorm'
import { ChatEntity } from './entities/chat.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ChatService {
	constructor(
		private chatGateway: ChatGateway,
		@InjectRepository(ChatEntity)
		private chatRepository: Repository<ChatEntity>
	) {}

	emit(event: string, data: any) {
		this.chatGateway.emit(event, data)
	}

	async getChatByGroupId(groupId: string): Promise<ChatEntity> {
		return await this.chatRepository.findOne({
			where: {
				groupId
			}
		})
	}
}
