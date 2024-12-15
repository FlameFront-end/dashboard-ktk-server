import { Module } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageEntity } from './entities/message.entity'
import { ChatEntity } from '../chat/entities/chat.entity'
import { AuthModule } from '../auth/auth.module'
import { MessagesController } from './messages.controller'

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([MessageEntity, ChatEntity])],
	controllers: [MessagesController],
	providers: [MessagesService],
	exports: [MessagesService]
})
export class MessagesModule {}
