import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm'
import { MessageEntity } from '../../messages/entities/message.entity'

@Entity('chats')
export class ChatEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	groupId: string

	@OneToMany(() => MessageEntity, message => message.chat)
	messages: MessageEntity[]

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
