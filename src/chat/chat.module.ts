import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { MessagesModule } from '../messages/messages.module'

@Module({
	imports: [MessagesModule],
	providers: [ChatService, ChatGateway],
	exports: [ChatService]
})
export class ChatModule {}
