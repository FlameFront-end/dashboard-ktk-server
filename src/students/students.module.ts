import { Module } from '@nestjs/common'
import { StudentsService } from './students.service'
import { StudentsController } from './students.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudentEntity } from './entities/student.entity'
import { MailModule } from '../mail/mail.module'
import { AuthModule } from '../auth/auth.module'
import { ChatModule } from '../chat/chat.module'
import { ChatEntity } from '../chat/entities/chat.entity'
import { GradeEntity } from '../groups/entities/grade.entity'

@Module({
	imports: [
		MailModule,
		AuthModule,
		ChatModule,
		TypeOrmModule.forFeature([StudentEntity, ChatEntity, GradeEntity])
	],
	controllers: [StudentsController],
	providers: [StudentsService]
})
export class StudentsModule {}
