import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { MessagesModule } from '../messages/messages.module'
import { ChatController } from './chat.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatEntity } from './entities/chat.entity'

@Module({
	imports: [MessagesModule, TypeOrmModule.forFeature([ChatEntity])],
	controllers: [ChatController],
	providers: [ChatService, ChatGateway],
	exports: [ChatService]
})
export class ChatModule {}
