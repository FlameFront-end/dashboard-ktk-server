import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne
} from 'typeorm'
import { StudentEntity } from '../../students/entities/student.entity'

@Entity('user')
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	password: string

	@Column()
	username: string

	@Column({ nullable: true })
	email: string

	@Column({ nullable: true })
	birthdate: string

	@Column({ default: false })
	isAdmin: boolean

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@OneToOne(() => StudentEntity, student => student.user)
	student: StudentEntity
}
