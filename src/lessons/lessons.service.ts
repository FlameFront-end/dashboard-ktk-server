import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { UpdateLessonDto } from './dto/update-lesson.dto'
import { LessonEntity } from './entities/lesson.entity'
import { DisciplineEntity } from '../disciplines/entities/discipline.entity'

@Injectable()
export class LessonsService {
	constructor(
		@InjectRepository(LessonEntity)
		private readonly lessonRepository: Repository<LessonEntity>,

		@InjectRepository(DisciplineEntity)
		private readonly disciplineRepository: Repository<DisciplineEntity>
	) {}

	async create(createLessonDto: CreateLessonDto): Promise<LessonEntity> {
		const discipline = await this.disciplineRepository.findOne({
			where: {
				id: createLessonDto.disciplineId
			}
		})

		const lesson = this.lessonRepository.create({
			...createLessonDto,
			discipline
		})

		return this.lessonRepository.save(lesson)
	}

	async findAll(): Promise<LessonEntity[]> {
		return this.lessonRepository.find()
	}

	async findOne(id: string): Promise<LessonEntity> {
		const lesson = await this.lessonRepository.findOneBy({ id })
		if (!lesson) {
			throw new NotFoundException(`Lesson with ID ${id} not found`)
		}
		return lesson
	}

	async update(
		id: string,
		updateLessonDto: UpdateLessonDto
	): Promise<LessonEntity> {
		const lesson = await this.findOne(id)
		Object.assign(lesson, updateLessonDto)
		return this.lessonRepository.save(lesson)
	}

	async remove(id: string): Promise<void> {
		await this.findOne(id)
		await this.lessonRepository.delete(id)
	}
}
