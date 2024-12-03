import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { GroupEntity } from './group.entity'
import { StudentEntity } from '../../students/entities/student.entity'
import { DisciplineEntity } from '../../disciplines/entities/discipline.entity'

@Entity('grades')
export class GradeEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	grade: string

	@Column({ type: 'date' })
	date: Date

	@ManyToOne(() => GroupEntity, group => group.grades)
	group: GroupEntity

	@ManyToOne(() => StudentEntity, student => student.grades)
	student: StudentEntity

	@ManyToOne(() => DisciplineEntity, discipline => discipline.grades)
	discipline: DisciplineEntity
}
