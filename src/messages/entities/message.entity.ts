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
import { TeacherEntity } from '../../teachers/entities/teacher.entity' //Import TeacherEntity

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

	@CreateDateColumn()
	createdAt: Date

	@ManyToOne(() => StudentEntity, student => student.messages, {
		onDelete: 'SET NULL',
		nullable: true
	})
	@JoinColumn({ name: 'studentSenderId' })
	studentSender: StudentEntity | null

	@ManyToOne(() => TeacherEntity, teacher => teacher.messages, {
		onDelete: 'SET NULL',
		nullable: true
	})
	@JoinColumn({ name: 'teacherSenderId' })
	teacherSender: TeacherEntity | null
}
