import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'
import { AdminsService } from './admins.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { AdminEntity } from './entities/admin.entity'
import { UpdateAdminDto } from './dto/update-admin.dto'

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
	constructor(private readonly adminsService: AdminsService) {}

	@Post()
	@ApiBody({ type: CreateAdminDto })
	async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminEntity> {
		return this.adminsService.create(createAdminDto)
	}

	@Get()
	async getAll(): Promise<AdminEntity[]> {
		return this.adminsService.findAll()
	}

	@Get(':id')
	async getById(@Param('id') id: string): Promise<AdminEntity> {
		return this.adminsService.findOne(id)
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateAdminDto: UpdateAdminDto
	): Promise<AdminEntity> {
		return this.adminsService.update(id, updateAdminDto)
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<{ message: string }> {
		await this.adminsService.delete(id)
		return { message: `Teacher with ID ${id} deleted successfully` }
	}
}
