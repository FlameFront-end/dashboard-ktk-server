import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	JoinColumn
} from 'typeorm'
import { ChatEntity } from '../../chat/entities/chat.entity'

export type SenderType = 'student' | 'teacher' | 'system'

export interface SenderMessage {
	id: string
	name: string
	phone: string | undefined
	email: string
}

@Entity('messages')
export class MessageEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	text: string

	@ManyToOne(() => ChatEntity, chat => chat.messages, { eager: true })
	@JoinColumn({ name: 'chatId' })
	chat: ChatEntity

	@CreateDateColumn()
	createdAt: Date

	@Column({ type: 'jsonb' })
	sender: SenderMessage

	@Column({ type: 'enum', enum: ['student', 'teacher', 'system'] })
	senderType: SenderType
}
