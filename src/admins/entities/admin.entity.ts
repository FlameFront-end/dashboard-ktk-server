import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity('admins')
export class AdminEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	email: string

	@Column()
	password: string

	@Column()
	name: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}