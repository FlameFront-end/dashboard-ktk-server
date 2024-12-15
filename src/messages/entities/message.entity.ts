import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	JoinColumn
} from 'typeorm'
import { ChatEntity } from '../../chat/entities/chat.entity'
import { StudentEntity } from '../../students/entities/student.entity'

@Entity('messages')
export class MessageEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	senderId: string // Use senderId instead of chatId for the student

	@Column()
	text: string

	@ManyToOne(() => ChatEntity, chat => chat.messages, { eager: true })
	@JoinColumn({ name: 'chatId' })
	chat: ChatEntity

	@ManyToOne(() => StudentEntity, student => student.messages, { eager: true })
	@JoinColumn({ name: 'senderId' }) // This uses senderId to link to the student
	sender: StudentEntity // Renamed to sender for clarity

	@CreateDateColumn()
	createdAt: Date
}
