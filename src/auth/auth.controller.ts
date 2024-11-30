import {
	Controller,
	Get,
	Param,
	Post,
	Request,
	UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	async login(@Request() req) {
		return this.authService.login(req.user)
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	getProfile(@Request() req) {
		return this.authService.getUserByEmail(req.user.email)
	}

	@Get('validate-token/:token')
	async validateToken(@Param('token') token: string) {
		return await this.authService.validateToken(token)
	}
}
