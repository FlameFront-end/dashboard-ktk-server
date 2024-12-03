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
	async create(
		@Body() createTeacherDto: CreateTeacherDto
	): Promise<TeacherEntity> {
		return this.teachersService.create(createTeacherDto)
	}

	@Get()
	async findAll(): Promise<TeacherEntity[]> {
		return this.teachersService.findAll()
	}

	@Get('without-group')
	async findTeachersWithoutGroup() {
		return this.teachersService.findWithoutGroup()
	}

	@Get(':id')
	async find(@Param('id') id: string): Promise<TeacherEntity> {
		return this.teachersService.find(id)
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
		await this.teachersService.delete(id)
		return { message: `Teacher with ID ${id} deleted successfully` }
	}
}
