import { ApiProperty } from '@nestjs/swagger'

export class SendEmailDto {
	@ApiProperty({ example: '5017_30@mail.ru' })
	readonly to: string

	@ApiProperty({ example: 'Subject mail' })
	readonly subject: string

	@ApiProperty({ example: 'Text mail', required: false })
	readonly text?: string

	@ApiProperty({ required: false, example: null })
	readonly html?: string
}
