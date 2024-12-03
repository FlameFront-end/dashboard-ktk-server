import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	ParseUUIDPipe
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { ApiTags } from '@nestjs/swagger'
import { UpdateGroupDto } from './dto/update-group.dto'

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

	@Get('without-teacher')
	async findGroupsWithoutTeacher() {
		return await this.groupsService.findWithoutTeacher()
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.groupsService.findOne(id)
	}

	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateGroupDto: UpdateGroupDto
	) {
		return await this.groupsService.update(id, updateGroupDto)
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		await this.groupsService.remove(id)
	}
}
