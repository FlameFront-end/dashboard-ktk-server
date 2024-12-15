import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn
} from 'typeorm'
import { MessageEntity } from '../../messages/entities/message.entity'
import { GroupEntity } from '../../groups/entities/group.entity'

@Entity('chats')
export class ChatEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ nullable: true })
	groupId: string

	@OneToMany(() => MessageEntity, message => message.chat)
	messages: MessageEntity[]

	@OneToOne(() => GroupEntity, group => group.chat, {
		onDelete: 'SET NULL'
	})
	@JoinColumn()
	group: GroupEntity

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
