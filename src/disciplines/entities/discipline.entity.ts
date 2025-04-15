import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
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

	@OneToMany(() => LessonEntity, lesson => lesson.discipline)
	lessons: LessonEntity[]

	@ManyToMany(() => TeacherEntity, teacher => teacher.disciplines)
	teachers: TeacherEntity[]
}
