import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { TeacherEntity } from './entities/teacher.entity'
import { UpdateTeacherDto } from './dto/update-teacher.dto'

@Injectable()
export class TeachersService {
	constructor(
		@InjectRepository(TeacherEntity)
		private readonly teacherRepository: Repository<TeacherEntity>
	) {}

	async createTeacher(
		createTeacherDto: CreateTeacherDto
	): Promise<TeacherEntity> {
		const teacher = this.teacherRepository.create(createTeacherDto)
		return this.teacherRepository.save(teacher)
	}

	async getAllTeachers(): Promise<TeacherEntity[]> {
		return this.teacherRepository.find()
	}

	async getTeacherById(id: string): Promise<TeacherEntity> {
		const teacher = await this.teacherRepository.findOne({ where: { id } })
		if (!teacher) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}
		return teacher
	}

	async update(id: string, updateTeacherDto: UpdateTeacherDto) {
		const teacher = await this.teacherRepository.findOne({ where: { id } })
		if (!teacher) {
			throw new NotFoundException(`Student with ID ${id} not found`)
		}
		Object.assign(teacher, updateTeacherDto)
		return this.teacherRepository.save(teacher)
	}

	async deleteTeacherById(id: string): Promise<void> {
		const result = await this.teacherRepository.delete(id)
		if (result.affected === 0) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}
	}
}
