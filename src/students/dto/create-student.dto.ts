import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateStudentDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	group: string

	@IsOptional()
	@IsString()
	birthDate?: string

	@IsOptional()
	@IsString()
	phone?: string

	@IsOptional()
	@IsString()
	email?: string
}
