import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { TeacherEntity } from '../../teachers/entities/teacher.entity'
import { GradeEntity } from '../../groups/entities/grade.entity'
import { LessonEntity } from '../../lessons/entities/lesson.entity'

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

	@OneToMany(() => TeacherEntity, teacher => teacher.discipline)
	teachers: TeacherEntity[]

	@OneToMany(() => GradeEntity, grade => grade.discipline)
	@JoinColumn()
	lessons: LessonEntity[]
}
