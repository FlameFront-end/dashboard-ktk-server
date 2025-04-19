import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFiles
} from '@nestjs/common'
import { LessonsService } from './lessons.service'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { LessonEntity } from './entities/lesson.entity'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'
import { filesStorage } from '../storage'
import { decodeOriginalName } from '../common/utils/encoding.util'

@Controller('lessons')
@ApiTags('lessons')
export class LessonsController {
	constructor(private readonly lessonsService: LessonsService) {}

	@Post()
	@ApiConsumes('multipart/form-data')
	@ApiBody({ type: CreateLessonDto })
	@UseInterceptors(FilesInterceptor('files', 10, { storage: filesStorage }))
	async create(
		@Body() createLessonDto: CreateLessonDto,
		@UploadedFiles() files: Express.Multer.File[]
	) {
		files.forEach(file => {
			file.originalname = decodeOriginalName(file.originalname)
		})

		createLessonDto.files = files
		return this.lessonsService.create(createLessonDto)
	}

	@Get()
	findAll() {
		return this.lessonsService.findAll()
	}

	@Get(':groupId/:disciplineId')
	async findLessonsByGroupAndDiscipline(
		@Param('groupId') groupId: string,
		@Param('disciplineId') disciplineId: string
	): Promise<LessonEntity[]> {
		return this.lessonsService.findByGroupAndDiscipline(groupId, disciplineId)
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.lessonsService.findOne(id)
	}

	@Patch(':id')
	@UseInterceptors(FilesInterceptor('files', 10, { storage: filesStorage }))
	async update(
		@Param('id') id: string,
		@Body() updateLessonDto: any,
		@UploadedFiles() files: Express.Multer.File[]
	) {
		files.forEach(file => {
			file.originalname = decodeOriginalName(file.originalname)
		})

		let existingFiles: any[] = []

		if (typeof updateLessonDto.files === 'string') {
			existingFiles = JSON.parse(updateLessonDto.files)
		} else if (Array.isArray(updateLessonDto.files)) {
			existingFiles = updateLessonDto.files
		}

		const newFiles = files.map(file => ({
			originalName: file.originalname,
			url: `http://localhost:3000/uploads/${file.filename}`
		}))

		updateLessonDto.files = [...existingFiles, ...newFiles]

		return this.lessonsService.update(id, updateLessonDto)
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return await this.lessonsService.remove(id)
	}
}
