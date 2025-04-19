import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class CreateLessonDto {
	@ApiProperty({ example: 'Математика РКИ', description: 'Название урока' })
	@IsString()
	@IsNotEmpty()
	title: string

	@ApiProperty({
		example: 'Описание урока',
		description: 'Описание урока',
		required: false
	})
	@IsString()
	@IsOptional()
	description?: string

	@ApiProperty({
		example: 'Домашнее задание',
		description: 'Домашнее задание',
		required: false
	})
	@IsString()
	@IsOptional()
	homework?: string

	@ApiProperty({
		example: '5ded386b-f6e9-49a7-8cdc-7bbbc88bba9c',
		description: 'ID группы'
	})
	@IsString()
	@IsNotEmpty()
	groupId: string

	@ApiProperty({
		example: '7d78b53a-390f-4685-8f9c-d49518fba0aa',
		description: 'ID дисциплины'
	})
	@IsString()
	@IsNotEmpty()
	disciplineId: string

	@ApiProperty({ example: '2025-04-08', description: 'Дата урока' })
	@IsString()
	@IsNotEmpty()
	date: string

	@ApiProperty({
		type: 'array',
		items: {
			type: 'string',
			format: 'binary'
		},
		description: 'Массив файлов',
		required: false
	})
	files?: any[]
}
