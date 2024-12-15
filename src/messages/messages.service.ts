import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MessageEntity } from './entities/message.entity'
import { CreateMessageDto } from './dto/create-message.dto'
import { ChatEntity } from '../chat/entities/chat.entity'
import { StudentEntity } from '../students/entities/student.entity'
import { TeacherEntity } from '../teachers/entities/teacher.entity'

@Injectable()
export class MessagesService {
	constructor(
		@InjectRepository(MessageEntity)
		private messageRepository: Repository<MessageEntity>,
		@InjectRepository(ChatEntity)
		private chatRepository: Repository<ChatEntity>,
		@InjectRepository(StudentEntity)
		private studentRepository: Repository<StudentEntity>,
		@InjectRepository(TeacherEntity)
		private teacherRepository: Repository<TeacherEntity>
	) {}

	async getAllMessages(chatId: string): Promise<MessageEntity[]> {
		return await this.messageRepository.find({
			where: {
				chat: {
					id: chatId
				}
			},
			relations: ['chat', 'studentSender', 'teacherSender']
		})
	}

	async create(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
		const { chatId, senderId, userId, senderType, text } = createMessageDto

		const chat = await this.chatRepository.findOne({ where: { id: chatId } })
		if (!chat) {
			throw new NotFoundException(`Chat with ID ${chatId} not found`)
		}

		let sender: StudentEntity | TeacherEntity | null = null

		if (senderType === 'student') {
			sender = await this.studentRepository.findOne({ where: { id: userId } })
		} else if (senderType === 'teacher') {
			sender = await this.teacherRepository.findOne({ where: { id: userId } })
		}

		if (!sender) {
			throw new NotFoundException(
				`Sender with ID ${senderId} and type ${senderType} not found`
			)
		}

		const newMessage = this.messageRepository.create({
			text,
			chat,
			studentSender: senderType === 'student' ? sender : null,
			teacherSender: senderType === 'teacher' ? sender : null
		})

		return await this.messageRepository.save(newMessage)
	}
}
