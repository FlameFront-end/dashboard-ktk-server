import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	ManyToOne,
	ManyToMany,
	JoinTable
} from 'typeorm'
import { ScheduleEntity } from './schedule.entity'
import { TeacherEntity } from '../../teachers/entities/teacher.entity'
import { StudentEntity } from '../../students/entities/student.entity'

@Entity('groups')
export class GroupEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@OneToOne(() => ScheduleEntity, schedule => schedule.group, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	schedule: ScheduleEntity

	@ManyToOne(() => TeacherEntity)
	@JoinColumn()
	teacher: TeacherEntity

	@ManyToMany(() => StudentEntity)
	@JoinTable()
	students: StudentEntity[]
}
