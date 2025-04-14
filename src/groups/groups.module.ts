import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { GroupEntity } from './entities/group.entity'
import { ScheduleEntity } from './entities/schedule.entity'
import { TeacherEntity } from '../teachers/entities/teacher.entity'
import { StudentEntity } from '../students/entities/student.entity'
import { DisciplineEntity } from '../disciplines/entities/discipline.entity'
import { GradeEntity } from './entities/grade.entity'
import { ChatEntity } from '../chat/entities/chat.entity'
import { MessagesModule } from '../messages/messages.module'
import { ChatModule } from '../chat/chat.module'

@Module({
	imports: [
		MessagesModule,
		ChatModule,
		TypeOrmModule.forFeature([
			GroupEntity,
			ScheduleEntity,
			TeacherEntity,
			StudentEntity,
			DisciplineEntity,
			GradeEntity,
			ChatEntity
		])
	],
	controllers: [GroupsController],
	providers: [GroupsService],
	exports: [GroupsService]
})
export class GroupsModule {}
