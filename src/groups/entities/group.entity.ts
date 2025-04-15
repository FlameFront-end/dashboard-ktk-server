import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	JoinTable,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToMany
} from 'typeorm'
import { ScheduleEntity } from './schedule.entity'
import { TeacherEntity } from '../../teachers/entities/teacher.entity'
import { StudentEntity } from '../../students/entities/student.entity'
import { GradeEntity } from './grade.entity'
import { ChatEntity } from '../../chat/entities/chat.entity'

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
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	schedule: ScheduleEntity

	@OneToMany(() => StudentEntity, students => students.group, {
		cascade: true,
		onDelete: 'SET NULL'
	})
	@JoinTable()
	students: StudentEntity[]

	@OneToMany(() => GradeEntity, grade => grade.group, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	grades: GradeEntity[]

	@OneToOne(() => ChatEntity, chat => chat.group, {
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	chat: ChatEntity

	@OneToOne(() => TeacherEntity, teacher => teacher.group, {
		cascade: false,
		onDelete: 'SET NULL'
	})
	teacher: TeacherEntity

	@ManyToMany(() => TeacherEntity, teacher => teacher.teachingGroups)
	teachingTeachers: TeacherEntity[]
}
