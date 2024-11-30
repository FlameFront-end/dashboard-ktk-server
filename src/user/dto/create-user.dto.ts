import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
	@ApiProperty({ example: 'user@example.com' })
	readonly email: string

	@ApiProperty({ example: 'password123' })
	readonly password: string

	@ApiProperty({ example: 'Ivanov' })
	readonly username: string

	@ApiProperty({ example: '1990-01-01', required: false })
	readonly birthdate?: string

	@ApiProperty({ example: false })
	readonly isAdmin?: boolean
}
