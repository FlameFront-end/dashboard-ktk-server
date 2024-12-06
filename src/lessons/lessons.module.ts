import { Module } from '@nestjs/common'
import { LessonsService } from './lessons.service'
import { LessonsController } from './lessons.controller'
import { LessonEntity } from './entities/lesson.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DisciplineEntity } from '../disciplines/entities/discipline.entity'

@Module({
	imports: [TypeOrmModule.forFeature([LessonEntity, DisciplineEntity])],
	controllers: [LessonsController],
	providers: [LessonsService]
})
export class LessonsModule {}
