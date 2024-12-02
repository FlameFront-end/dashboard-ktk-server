import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { TeacherEntity } from '../../teachers/entities/teacher.entity'

@Entity('disciplines')
export class DisciplineEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@OneToOne(() => TeacherEntity, teacher => teacher.discipline)
	teacher: DisciplineEntity
}
