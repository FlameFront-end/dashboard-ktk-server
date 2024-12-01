import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateStudentDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	email: string

	@IsNotEmpty()
	@IsString()
	groupId: string

	@IsOptional()
	@IsString()
	birthDate?: string

	@IsOptional()
	@IsString()
	phone?: string
}
