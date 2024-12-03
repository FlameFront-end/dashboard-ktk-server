import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeachersService } from './teachers.service'
import { TeachersController } from './teachers.controller'
import { TeacherEntity } from './entities/teacher.entity'
import { MailModule } from '../mail/mail.module'
import { AuthModule } from '../auth/auth.module'
import { DisciplineEntity } from '../disciplines/entities/discipline.entity'
import { GroupEntity } from '../groups/entities/group.entity'
import { ScheduleEntity } from '../groups/entities/schedule.entity'

@Module({
	imports: [
		MailModule,
		AuthModule,
		TypeOrmModule.forFeature([
			TeacherEntity,
			DisciplineEntity,
			GroupEntity,
			ScheduleEntity
		])
	],
	controllers: [TeachersController],
	providers: [TeachersService]
})
export class TeachersModule {}
