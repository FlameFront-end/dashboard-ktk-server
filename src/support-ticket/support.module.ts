import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupportController } from './support.controller'
import { SupportService } from './support.service'
import { SupportTicketEntity } from './entities/support-ticket.entity'
import { StudentEntity } from '../students/entities/student.entity'
import { TeacherEntity } from '../teachers/entities/teacher.entity'
import { AdminEntity } from '../admins/entities/admin.entity'
import { TelegramModule } from '../telegram/telegram.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			SupportTicketEntity,
			StudentEntity,
			TeacherEntity,
			AdminEntity
		]),
		TelegramModule
	],
	controllers: [SupportController],
	providers: [SupportService]
})
export class SupportModule {}
