import { Request } from 'express'

export interface IUser {
	id: string
	email: string
	password: string
	name: string
	role: 'teacher' | 'student' | 'admin'
	createdAt: string
	updatedAt: string
	group?: {
		id: string
		name: string
		createdAt: string
		updatedAt: string
	} | null
}

export interface UserRequest extends Request {
	user: {
		id: string
		email: string
		username: string
	}
}

interface SystemSender {}
