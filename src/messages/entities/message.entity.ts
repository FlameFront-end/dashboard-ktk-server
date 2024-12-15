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

	@Column({ nullable: true })
	senderId: string

	@Column()
	text: string

	@ManyToOne(() => ChatEntity, chat => chat.messages, { eager: true })
	@JoinColumn({ name: 'chatId' })
	chat: ChatEntity

	@ManyToOne(() => StudentEntity, student => student.messages, {
		onDelete: 'SET NULL'
	})
	@JoinColumn({ name: 'senderId' })
	sender: StudentEntity

	@CreateDateColumn()
	createdAt: Date
}
