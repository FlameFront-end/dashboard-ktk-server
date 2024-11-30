import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('user_details')
export class UserDetailsEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: true })
	shortInfo: string

	@Column({ nullable: true })
	city: string

	@Column({ nullable: true })
	mobilePhone: string

	@Column({ nullable: true })
	additionalPhone: string

	@Column({ nullable: true })
	skype: string

	@Column({ nullable: true })
	site: string

	@Column({ nullable: true })
	activity: string

	@Column({ nullable: true })
	interests: string

	@Column({ nullable: true })
	music: string

	@Column({ nullable: true })
	movies: string

	@Column({ nullable: true })
	TVShows: string

	@Column({ nullable: true })
	games: string

	@Column({ nullable: true })
	quotes: string

	@Column({ type: 'json', default: [] })
	grandparents: string[]

	@Column({ type: 'json', default: [] })
	parents: string[]

	@Column({ type: 'json', default: [] })
	siblings: string[]

	@Column({ type: 'json', default: [] })
	children: string[]

	@Column({ type: 'json', default: [] })
	grandsons: string[]
}
