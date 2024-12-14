import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const WithSchedule = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): boolean => {
		const req = ctx.switchToHttp().getRequest()
		return req.query.withSchedule === 'true' || req.body?.withSchedule === true
	}
)
