import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { DisciplineEntity } from '../../disciplines/entities/discipline.entity'

@Entity('lessons')
export class LessonEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	title: string

	@Column()
	date: string

	@Column({ nullable: true })
	description: string

	@Column({ nullable: true })
	homework: string

	@Column()
	groupId: string

	@ManyToOne(() => DisciplineEntity, discipline => discipline.lessons)
	@JoinColumn()
	discipline: DisciplineEntity

	@Column('json', { nullable: true })
	files: { originalName: string; url: string }[]
}
