import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTeacherDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	email: string

	@IsNotEmpty()
	@IsString()
	discipline: string

	@IsOptional()
	@IsString()
	groupId?: string
}
