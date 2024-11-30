import { Request } from 'express'

export interface IUser {
	id: string
	email: string
	username: string
}

export interface UserRequest extends Request {
	user: {
		id: string
		email: string
		username: string
	}
}
