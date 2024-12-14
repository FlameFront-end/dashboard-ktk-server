import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn,
	ManyToOne
} from 'typeorm'
import { GroupEntity } from '../../groups/entities/group.entity'
import { DisciplineEntity } from '../../disciplines/entities/discipline.entity'

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

	@Column({ default: 'teacher' })
	role: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@OneToOne(() => GroupEntity, group => group.teacher, {
		onDelete: 'SET NULL'
	})
	@JoinColumn()
	group: GroupEntity

	@ManyToOne(() => DisciplineEntity, discipline => discipline.teachers)
	@JoinColumn()
	discipline: DisciplineEntity
}
