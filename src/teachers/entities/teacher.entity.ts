import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne
} from 'typeorm'
import { GroupEntity } from '../../groups/entities/group.entity'

@Entity('teachers')
export class TeacherEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	email: string

	@Column()
	password: string

	@Column()
	name: string

	@Column()
	discipline: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@OneToOne(() => GroupEntity, group => group.teacher)
	group: GroupEntity
}
