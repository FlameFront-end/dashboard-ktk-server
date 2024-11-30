import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'

@Entity('students')
export class StudentEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@Column()
	group: string

	@Column({ nullable: true })
	birthDate?: string

	@Column({ nullable: true })
	phone?: string

	@Column()
	email: string

	@OneToOne(() => UserEntity, user => user.student, {
		onDelete: 'CASCADE',
		eager: true
	})
	@JoinColumn()
	user: UserEntity
}
