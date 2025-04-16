// support-ticket.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne
} from 'typeorm'
import { StudentEntity } from '../../students/entities/student.entity'
import { TeacherEntity } from '../../teachers/entities/teacher.entity'
import { AdminEntity } from '../../admins/entities/admin.entity'

export type TicketStatus = 'open' | 'in_progress' | 'closed'
export type TicketUserType = 'student' | 'teacher' | 'admin'

@Entity('support_tickets')
export class SupportTicketEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	message: string

	@Column({
		type: 'enum',
		enum: ['open', 'in_progress', 'closed'],
		default: 'open'
	})
	status: TicketStatus

	@Column({ nullable: true })
	supportReply: string

	@Column({ type: 'enum', enum: ['student', 'teacher', 'admin'] })
	userType: TicketUserType

	@ManyToOne(() => StudentEntity, { nullable: true, eager: true })
	student?: StudentEntity

	@ManyToOne(() => TeacherEntity, { nullable: true, eager: true })
	teacher?: TeacherEntity

	@ManyToOne(() => AdminEntity, { nullable: true, eager: true })
	admin?: AdminEntity

	@CreateDateColumn()
	createdAt: Date
}
