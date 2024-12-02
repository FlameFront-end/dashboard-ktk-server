import { Injectable } from '@nestjs/common'
import { CreateDisciplineDto } from './dto/create-discipline.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DisciplineEntity } from './entities/discipline.entity'

@Injectable()
export class DisciplinesService {
	constructor(
		@InjectRepository(DisciplineEntity)
		private readonly disciplineRepository: Repository<DisciplineEntity>
	) {}

	async create(createDisciplineDto: CreateDisciplineDto) {
		return await this.disciplineRepository.save(createDisciplineDto)
	}

	async findAll() {
		return this.disciplineRepository.find()
	}

	async findOne(id: string) {
		return await this.disciplineRepository.findOne({
			where: { id }
		})
	}

	async remove(id: number) {
		return await this.disciplineRepository.delete(id)
	}
}
