import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { GroupEntity } from './entities/group.entity'
import { ScheduleEntity } from './entities/schedule.entity'
import { TeacherEntity } from '../teachers/entities/teacher.entity'
import { StudentEntity } from '../students/entities/student.entity'
import { DisciplineEntity } from '../disciplines/entities/discipline.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			GroupEntity,
			ScheduleEntity,
			TeacherEntity,
			StudentEntity,
			DisciplineEntity
		])
	],
	controllers: [GroupsController],
	providers: [GroupsService]
})
export class GroupsModule {}
