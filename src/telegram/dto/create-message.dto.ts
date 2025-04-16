import { ApiProperty } from '@nestjs/swagger'

export class CreateMessageDto {
	@ApiProperty()
	readonly message: string
}
