import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAdminDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'Flame Admin' })
	name: string

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: '5017_30@mail.ru' })
	email: string

	@IsOptional()
	@IsString()
	@ApiProperty({ example: '79011272636', required: false })
	phone?: string
}
