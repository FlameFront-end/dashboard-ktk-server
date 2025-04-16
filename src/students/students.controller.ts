import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch
} from '@nestjs/common'
import { ApiBody, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { StudentsService } from './students.service'
import { CreateStudentDto } from './dto/create-student.dto'
import { StudentEntity } from './entities/student.entity'
import { UpdateStudentDto } from './dto/update-student.dto'

@ApiTags('students')
@Controller('students')
export class StudentsController {
	constructor(private readonly studentsService: StudentsService) {}

	@Post()
	@ApiBody({ type: CreateStudentDto })
	async create(
		@Body() createStudentDto: CreateStudentDto
	): Promise<StudentEntity> {
		return this.studentsService.create(createStudentDto)
	}

	@Get()
	async getAll(): Promise<StudentEntity[]> {
		return this.studentsService.findAll()
	}

	@Get('without-group')
	async getStudentsWithoutGroup(): Promise<StudentEntity[]> {
		return this.studentsService.findWithoutGroup()
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

	@Delete(':id/group')
	async removeFromGroup(@Param('id') id: string): Promise<{ message: string }> {
		await this.studentsService.removeFromGroup(id)
		return { message: `Student with ID ${id} removed from group successfully.` }
	}

	@Get(':id/grades')
	@ApiOperation({
		summary: 'Get all grades of a student grouped by disciplines'
	})
	@ApiResponse({ status: 200, description: 'Grades grouped by disciplines' })
	@ApiResponse({ status: 404, description: 'Student not found' })
	async getStudentGradesGroupedByDisciplines(
		@Param('id') studentId: string
	): Promise<any> {
		return this.studentsService.getStudentGradesGroupedByDisciplines(studentId)
	}
}
