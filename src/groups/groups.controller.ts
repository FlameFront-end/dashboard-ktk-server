import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
	constructor(private readonly groupsService: GroupsService) {}

	@Post()
	async create(@Body() createGroupDto: CreateGroupDto) {
		return await this.groupsService.create(createGroupDto)
	}

	@Get()
	async findAll() {
		return await this.groupsService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.groupsService.findOne(id)
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		await this.groupsService.remove(id)
	}
}
