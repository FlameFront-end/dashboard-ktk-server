import { Module } from '@nestjs/common'
import { DisciplinesService } from './disciplines.service'
import { DisciplinesController } from './disciplines.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DisciplineEntity } from './entities/discipline.entity'
import { GradeEntity } from '../groups/entities/grade.entity'
import { LessonEntity } from '../lessons/entities/lesson.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([DisciplineEntity, GradeEntity, LessonEntity])
	],
	controllers: [DisciplinesController],
	providers: [DisciplinesService]
})
export class DisciplinesModule {}
