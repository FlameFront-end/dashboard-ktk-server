import { ApiProperty } from '@nestjs/swagger'
import { TeacherEntity } from '../../teachers/entities/teacher.entity'
import { StudentEntity } from '../../students/entities/student.entity'

export class CreateUserDto {
	@ApiProperty({ example: 'user@example.com' })
	readonly email: string

	@ApiProperty({ example: 'password123' })
	readonly password: string

	@ApiProperty({ example: 'Ivanov' })
	readonly username: string

	@ApiProperty({ required: false })
	readonly teacher?: TeacherEntity

	@ApiProperty({ required: false })
	readonly student?: StudentEntity

	@ApiProperty({ example: '1990-01-01', required: false })
	readonly birthdate?: string

	@ApiProperty({ example: false })
	readonly isAdmin?: boolean

	@ApiProperty({ example: false })
	readonly isTeacher?: boolean

	@ApiProperty({ example: false })
	readonly isStudent?: boolean
}
