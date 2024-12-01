import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	Delete,
	Patch
} from '@nestjs/common'
import { TeachersService } from './teachers.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { TeacherEntity } from './entities/teacher.entity'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { UpdateTeacherDto } from './dto/update-teacher.dto'

@ApiTags('teachers')
@Controller('teachers')
export class TeachersController {
	constructor(private readonly teachersService: TeachersService) {}

	@Post()
	@ApiBody({ type: CreateTeacherDto })
	async createTeacher(
		@Body() createTeacherDto: CreateTeacherDto
	): Promise<TeacherEntity> {
		return this.teachersService.createTeacher(createTeacherDto)
	}

	@Get()
	async getAllTeachers(): Promise<TeacherEntity[]> {
		return this.teachersService.getAllTeachers()
	}

	@Get(':id')
	async getTeacherById(@Param('id') id: string): Promise<TeacherEntity> {
		return this.teachersService.getTeacherById(id)
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateTeacherDto: UpdateTeacherDto
	): Promise<TeacherEntity> {
		return this.teachersService.update(id, updateTeacherDto)
	}

	@Delete(':id')
	async deleteTeacherById(
		@Param('id') id: string
	): Promise<{ message: string }> {
		await this.teachersService.deleteTeacherById(id)
		return { message: `Teacher with ID ${id} deleted successfully` }
	}
}
