import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('teachers')
export class TeacherEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@Column()
	discipline: string

	@Column({ nullable: true })
	group?: string
}
