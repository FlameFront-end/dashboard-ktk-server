import { IsNotEmpty, IsString } from 'class-validator'

export class CreateLessonDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	description: string

	@IsString()
	homework: string

	@IsString()
	@IsNotEmpty()
	groupId: string

	@IsString()
	@IsNotEmpty()
	disciplineId: string

	@IsString()
	@IsNotEmpty()
	date: string

	files: any
}
