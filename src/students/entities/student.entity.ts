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

	@Column({ nullable: true })
	email?: string

	@OneToOne(() => UserEntity, { cascade: true, eager: true })
	@JoinColumn()
	user: UserEntity
}
