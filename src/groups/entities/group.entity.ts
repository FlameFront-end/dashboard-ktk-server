import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	JoinTable,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany
} from 'typeorm'
import { ScheduleEntity } from './schedule.entity'
import { TeacherEntity } from '../../teachers/entities/teacher.entity'
import { StudentEntity } from '../../students/entities/student.entity'
import { GradeEntity } from './grade.entity'

@Entity('groups')
export class GroupEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@OneToOne(() => ScheduleEntity, schedule => schedule.group, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	schedule: ScheduleEntity

	@OneToOne(() => TeacherEntity, teacher => teacher.group, {
		cascade: true,
		onDelete: 'SET NULL'
	})
	@JoinTable()
	teacher: TeacherEntity

	@OneToMany(() => StudentEntity, students => students.group, {
		cascade: true,
		onDelete: 'SET NULL'
	})
	@JoinTable()
	students: StudentEntity[]

	@OneToMany(() => GradeEntity, grade => grade.group)
	grades: GradeEntity[]
}
