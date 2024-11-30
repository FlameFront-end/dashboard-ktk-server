import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { IUser } from '../types/types'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findOneByEmail(email)
		const passwordIsMatch = await argon2.verify(user.password, password)

		if (user && passwordIsMatch) {
			return user
		}

		throw new UnauthorizedException('Неверная почта или пароль!')
	}

	async login(user: IUser) {
		const { id, email, username } = user

		return {
			id,
			username,
			email,
			token: this.jwtService.sign({ id: user.id, email: user.email })
		}
	}

	async getUserByEmail(email: string) {
		return await this.userService.findOneByEmail(email)
	}

	async validateToken(token: string) {
		try {
			const decoded = this.jwtService.verify(token)
			const user = await this.userService.findOneById(decoded.id)
			return {
				token: token,
				email: user.email,
				id: user.id,
				username: user.username
			}
		} catch (error) {
			throw new UnauthorizedException('Неверный токен!')
		}
	}
}
