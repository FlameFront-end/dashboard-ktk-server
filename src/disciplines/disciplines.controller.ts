import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch
} from '@nestjs/common'
import { DisciplinesService } from './disciplines.service'
import { CreateDisciplineDto } from './dto/create-discipline.dto'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { UpdateDisciplineDto } from './dto/update-discipline.dto'
import { DisciplineEntity } from './entities/discipline.entity'

@ApiTags('disciplines')
@Controller('disciplines')
export class DisciplinesController {
	constructor(private readonly disciplinesService: DisciplinesService) {}

	@Post()
	@ApiBody({ type: CreateDisciplineDto })
	create(@Body() createDisciplineDto: CreateDisciplineDto) {
		return this.disciplinesService.create(createDisciplineDto)
	}

	@Get()
	findAll() {
		return this.disciplinesService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.disciplinesService.findOne(id)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.disciplinesService.remove(id)
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateDisciplineDto: UpdateDisciplineDto
	): Promise<DisciplineEntity> {
		return this.disciplinesService.update(id, updateDisciplineDto)
	}
}
