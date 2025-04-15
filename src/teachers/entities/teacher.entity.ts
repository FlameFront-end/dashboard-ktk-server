import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn,
	ManyToMany,
	JoinTable
} from 'typeorm'
import { GroupEntity } from '../../groups/entities/group.entity'
import { DisciplineEntity } from '../../disciplines/entities/discipline.entity'
import { Exclude } from 'class-transformer'

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
		onDelete: 'SET NULL',
		cascade: false
	})
	@JoinColumn()
	@Exclude()
	group: GroupEntity

	@ManyToMany(() => DisciplineEntity, discipline => discipline.teachers, {
		cascade: true
	})
	@JoinTable()
	disciplines: DisciplineEntity[]

	@ManyToMany(() => GroupEntity, group => group.teachingTeachers, {
		cascade: true
	})
	@JoinTable()
	teachingGroups: GroupEntity[]
}
