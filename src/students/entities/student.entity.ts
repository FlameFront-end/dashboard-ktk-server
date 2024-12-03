import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { GroupEntity } from '../../groups/entities/group.entity'

@Entity('students')
export class StudentEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	email: string

	@Column()
	password: string

	@Column()
	name: string

	@Column({ nullable: true })
	birthDate?: string

	@Column({ nullable: true })
	phone?: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@ManyToOne(() => GroupEntity, group => group.students, {
		onDelete: 'SET NULL'
	})
	@JoinColumn()
	group: GroupEntity
}
