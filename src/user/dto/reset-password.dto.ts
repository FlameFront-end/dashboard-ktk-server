import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto {
	@ApiProperty()
	readonly old_password: string

	@ApiProperty()
	readonly new_password: string
}
