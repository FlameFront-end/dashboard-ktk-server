import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { GroupEntity } from '../../groups/entities/group.entity'
import { GradeEntity } from '../../groups/entities/grade.entity'
import { MessageEntity } from '../../messages/entities/message.entity'

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

	@Column({ default: 'student' })
	role: string

	@Column({ nullable: true })
	birthDate?: string

	@Column({ nullable: true })
	phone?: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@OneToMany(() => GradeEntity, grade => grade.student)
	grades: GradeEntity[]

	@ManyToOne(() => GroupEntity, group => group.students, {
		onDelete: 'SET NULL'
	})
	@JoinColumn()
	group: GroupEntity
}
