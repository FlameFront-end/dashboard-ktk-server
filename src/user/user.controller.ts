import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Request,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import * as argon2 from 'argon2'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('user')
@ApiTags('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/register')
	@ApiBody({ type: CreateUserDto })
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	// @Patch('/update')
	// @ApiBody({ type: UpdateUserDto })
	// @UseGuards(JwtAuthGuard)
	// async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
	// 	return this.userService.update(req.user.id, updateUserDto)
	// }

	@Patch('/reset-password')
	@UseGuards(JwtAuthGuard)
	async resetPassword(@Request() req, @Body() body: ResetPasswordDto) {
		const { old_password, new_password } = body
		const user = await this.userService.findOneByEmail(req.user.email)

		const isOldPasswordValid = await argon2.verify(user.password, old_password)

		if (isOldPasswordValid) {
			await this.userService.resetPassword(user, new_password)
			return { message: 'Password reset successful' }
		} else {
			throw new UnauthorizedException('Old password is incorrect')
		}
	}

	@Get('/all')
	async getAllUsers(@Query('details') details?: string) {
		return await this.userService.getAllUsers(details === 'true')
	}

	@Get(':id')
	async findOneById(
		@Param('id') id: string,
		@Query('details') details?: string
	) {
		return this.userService.findOneById(id, details === 'true')
	}
}
