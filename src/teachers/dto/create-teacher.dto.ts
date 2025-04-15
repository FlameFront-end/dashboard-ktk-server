import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	ArrayNotEmpty,
	IsEmail
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTeacherDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'Учитель математики и экономики' })
	name: string

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@ApiProperty({ example: '1111_11@mail.ru' })
	email: string

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	@ApiProperty({
		example: [
			'7e0a976a-34b7-4d62-bf68-91e26fa52ce2',
			'7d78b53a-390f-4685-8f9c-d49518fba0aa'
		]
	})
	disciplinesIds: string[]

	@IsOptional()
	@IsString()
	group?: string
}
