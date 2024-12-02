import { Module } from '@nestjs/common'
import { DisciplinesService } from './disciplines.service'
import { DisciplinesController } from './disciplines.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DisciplineEntity } from './entities/discipline.entity'

@Module({
	imports: [TypeOrmModule.forFeature([DisciplineEntity])],
	controllers: [DisciplinesController],
	providers: [DisciplinesService]
})
export class DisciplinesModule {}
