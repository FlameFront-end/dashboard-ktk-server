import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DisciplineEntity } from './entities/discipline.entity'
import { UpdateDisciplineDto } from './dto/update-discipline.dto'
import { CreateDisciplineDto } from './dto/create-discipline.dto'
import { GradeEntity } from '../groups/entities/grade.entity'
import { LessonEntity } from '../lessons/entities/lesson.entity'

@Injectable()
export class DisciplinesService {
	constructor(
		@InjectRepository(DisciplineEntity)
		private readonly disciplineRepository: Repository<DisciplineEntity>,

		@InjectRepository(GradeEntity)
		private gradeRepository: Repository<GradeEntity>,

		@InjectRepository(LessonEntity)
		private lessonRepository: Repository<LessonEntity>
	) {}

	async create(createDisciplineDto: CreateDisciplineDto) {
		return await this.disciplineRepository.save(createDisciplineDto)
	}

	async findAll() {
		return this.disciplineRepository.find({
			order: {
				updatedAt: 'DESC'
			}
		})
	}

	async findOne(id: string) {
		return await this.disciplineRepository.findOne({
			where: { id }
		})
	}

	async remove(id: string) {
		await this.gradeRepository.delete({ discipline: { id: id } })
		await this.lessonRepository.delete({ discipline: { id: id } })

		return await this.disciplineRepository.delete(id)
	}

	async update(id: string, updateDisciplineDto: UpdateDisciplineDto) {
		const discipline = await this.disciplineRepository.findOne({
			where: { id }
		})
		if (!discipline) {
			throw new NotFoundException(`Discipline with ID ${id} not found`)
		}
		Object.assign(discipline, updateDisciplineDto)
		return this.disciplineRepository.save(discipline)
	}
}
