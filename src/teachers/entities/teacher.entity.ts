import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn
} from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'

@Entity('teachers')
export class TeacherEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@Column()
	email: string

	@Column()
	discipline: string

	@Column({ nullable: true })
	group?: string

	@OneToOne(() => UserEntity, user => user.teacher, {
		onDelete: 'CASCADE',
		eager: true
	})
	@JoinColumn()
	user: UserEntity
}
