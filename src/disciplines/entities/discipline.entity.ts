import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { TeacherEntity } from '../../teachers/entities/teacher.entity'
import { GradeEntity } from '../../groups/entities/grade.entity'

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

	@OneToMany(() => GradeEntity, grade => grade.discipline)
	grades: GradeEntity[]

	@OneToOne(() => TeacherEntity, teacher => teacher.discipline)
	teacher: DisciplineEntity
}
