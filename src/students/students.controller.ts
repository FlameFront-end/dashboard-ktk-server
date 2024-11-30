import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StudentsService } from './students.service'
import { CreateStudentDto } from './dto/create-student.dto'
import { StudentEntity } from './entities/student.entity'
import { UpdateStudentDto } from './dto/update-student.dto'

@ApiTags('students')
@Controller('students')
export class StudentsController {
	constructor(private readonly studentsService: StudentsService) {}

	@Post()
	async create(
		@Body() createStudentDto: CreateStudentDto
	): Promise<StudentEntity> {
		return this.studentsService.create(createStudentDto)
	}

	@Get()
	async getAll(): Promise<StudentEntity[]> {
		return this.studentsService.findAll()
	}

	@Get(':id')
	async getById(@Param('id') id: string): Promise<StudentEntity> {
		return this.studentsService.findOne(id)
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateStudentDto: UpdateStudentDto
	): Promise<StudentEntity> {
		return this.studentsService.update(id, updateStudentDto)
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<{ message: string }> {
		await this.studentsService.delete(id)
		return { message: `Teacher with ID ${id} deleted successfully` }
	}
}
