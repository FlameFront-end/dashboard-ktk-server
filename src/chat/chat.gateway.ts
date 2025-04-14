import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Inject } from '@nestjs/common'
import { MessagesService } from '../messages/messages.service'
import { MessageEntity } from '../messages/entities/message.entity'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server

	constructor(
		@Inject(MessagesService) private messageService: MessagesService
	) {}

	private clientsInRooms = new Map<string, Set<string>>()

	handleConnection(client: Socket) {
		// console.log(`Client connected: ${client.id}`)
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, payload: { chatId: string }) {
		const { chatId } = payload

		if (!this.clientsInRooms.has(chatId)) {
			this.clientsInRooms.set(chatId, new Set())
		}

		const roomClients = this.clientsInRooms.get(chatId)!
		roomClients.add(client.id)
		client.join(chatId)
	}

	@SubscribeMessage('leaveRoom')
	handleLeaveRoom(client: Socket, payload: { chatId: string }) {
		const { chatId } = payload
		const roomClients = this.clientsInRooms.get(chatId)
		if (roomClients) {
			roomClients.delete(client.id)
			client.leave(chatId)
			if (roomClients.size === 0) {
				this.clientsInRooms.delete(chatId)
			}
		}
	}

	@SubscribeMessage('sendMessage')
	async handleMessage(
		client: Socket,
		payload: {
			userId: string
			chatId: string
			message: string
			senderType: 'student' | 'teacher' | 'system'
		}
	) {
		const newMessage = await this.messageService.create({
			senderId: client.id,
			userId: payload.userId,
			text: payload.message,
			chatId: payload.chatId,
			senderType: payload.senderType
		})

		this.server.to(payload.chatId).emit('newMessage', newMessage)
	}

	handleDisconnect(client: Socket) {
		this.clientsInRooms.forEach((clients, roomId) => {
			clients.delete(client.id)
			if (clients.size === 0) {
				this.clientsInRooms.delete(roomId)
			}
		})
		// console.log(`Client disconnected: ${client.id}`)
	}

	emit(event: string, data: any) {
		this.server.emit(event, data)
	}

	broadcastParticipantUpdate(chatId: string, message: MessageEntity) {
		this.server.to(chatId).emit('participantUpdate', message)
	}
}
