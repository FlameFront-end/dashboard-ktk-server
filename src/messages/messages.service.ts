import {
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MessageEntity } from './entities/message.entity'
import { CreateMessageDto } from './dto/create-message.dto'
import { ChatEntity } from '../chat/entities/chat.entity'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class MessagesService {
	constructor(
		private readonly authService: AuthService,

		@InjectRepository(MessageEntity)
		private messageRepository: Repository<MessageEntity>,
		@InjectRepository(ChatEntity)
		private chatRepository: Repository<ChatEntity>
	) {}

	async getAllMessages(chatId: string): Promise<MessageEntity[]> {
		return await this.messageRepository.find({
			where: {
				chat: {
					id: chatId
				}
			},
			relations: ['sender']
		})
	}

	async create(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
		const chat = await this.chatRepository.findOne({
			where: { id: createMessageDto.chatId }
		})

		const user = await this.authService.findOneById(createMessageDto.userId)

		if (!chat) {
			throw new NotFoundException(
				`Chat with ID ${createMessageDto.chatId} not found`
			)
		}

		if (!user) {
			throw new NotFoundException(
				`User with ID ${createMessageDto.userId} not found`
			)
		}

		const newMessage = this.messageRepository.create({
			...createMessageDto,
			chat,
			sender: user
		})

		try {
			return await this.messageRepository.save(newMessage)
		} catch (error) {
			throw new InternalServerErrorException('Error saving message')
		}
	}
}
