import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDisciplineDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'Математика' })
	name: string
}
