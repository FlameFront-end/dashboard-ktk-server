import { Module } from '@nestjs/common'
import { StudentsService } from './students.service'
import { StudentsController } from './students.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudentEntity } from './entities/student.entity'
import { TeacherEntity } from '../teachers/entities/teacher.entity'
import { ScheduleEntity } from '../groups/entities/schedule.entity'
import { UserEntity } from '../user/entities/user.entity'
import { MailModule } from '../mail/mail.module'

@Module({
	imports: [
		MailModule,
		TypeOrmModule.forFeature([
			StudentEntity,
			TeacherEntity,
			ScheduleEntity,
			UserEntity
		])
	],
	controllers: [StudentsController],
	providers: [StudentsService]
})
export class StudentsModule {}
