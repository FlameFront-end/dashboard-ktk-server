import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { DisciplinesService } from './disciplines.service'
import { CreateDisciplineDto } from './dto/create-discipline.dto'
import { ApiBody, ApiTags } from '@nestjs/swagger'

@ApiTags('disciplines')
@Controller('disciplines')
export class DisciplinesController {
	constructor(private readonly lessonsService: DisciplinesService) {}

	@Post()
	@ApiBody({ type: CreateDisciplineDto })
	create(@Body() createDisciplineDto: CreateDisciplineDto) {
		return this.lessonsService.create(createDisciplineDto)
	}

	@Get()
	findAll() {
		return this.lessonsService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.lessonsService.findOne(id)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.lessonsService.remove(+id)
	}
}
