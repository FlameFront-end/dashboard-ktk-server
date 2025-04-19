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
			where: { id: createLessonDto.disciplineId }
		})
		if (!discipline) throw new Error('Discipline not found')

		const filesData =
			createLessonDto.files?.map((file: Express.Multer.File) => ({
				originalName: file.originalname,
				url: `http://localhost:3000/uploads/${file.filename}`
			})) || []

		const lesson = this.lessonRepository.create({
			...createLessonDto,
			discipline,
			files: filesData
		})

		return this.lessonRepository.save(lesson)
	}

	async findAll(): Promise<LessonEntity[]> {
		return this.lessonRepository.find()
	}

	async findByGroupAndDiscipline(
		groupId: string,
		disciplineId: string
	): Promise<LessonEntity[]> {
		return this.lessonRepository.find({
			where: {
				groupId: groupId,
				discipline: {
					id: disciplineId
				}
			},
			relations: ['discipline']
		})
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
		if (!lesson) {
			throw new Error('Lesson not found')
		}

		Object.assign(lesson, updateLessonDto)

		if (updateLessonDto.files && Array.isArray(updateLessonDto.files)) {
			lesson.files = updateLessonDto.files.filter(file => !!file.url)
		} else {
			lesson.files = []
		}

		return this.lessonRepository.save(lesson)
	}

	async remove(id: string): Promise<void> {
		await this.findOne(id)
		await this.lessonRepository.delete(id)
	}
}
