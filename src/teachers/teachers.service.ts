import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, In, Repository } from 'typeorm'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { TeacherEntity } from './entities/teacher.entity'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import { MailService } from '../mail/mail.service'
import { generatePassword } from '../utils/generatePassword'
import { AuthService } from '../auth/auth.service'
import { DisciplineEntity } from '../disciplines/entities/discipline.entity'
import * as argon2 from 'argon2'
import { GroupEntity } from '../groups/entities/group.entity'
import { Lesson, ScheduleEntity } from '../groups/entities/schedule.entity'

@Injectable()
export class TeachersService {
	constructor(
		@InjectRepository(TeacherEntity)
		private readonly teacherRepository: Repository<TeacherEntity>,

		@InjectRepository(DisciplineEntity)
		private readonly disciplineRepository: Repository<DisciplineEntity>,

		@InjectRepository(GroupEntity)
		private readonly groupRepository: Repository<GroupEntity>,

		@InjectRepository(ScheduleEntity)
		private readonly scheduleRepository: Repository<ScheduleEntity>,

		private readonly mailService: MailService,

		private readonly authService: AuthService
	) {}

	async create(createTeacherDto: CreateTeacherDto) {
		const existUser = await this.authService.findOneByEmail(
			createTeacherDto.email
		)

		if (existUser) {
			throw new ConflictException('User with this email already exists')
		}

		const password = generatePassword()
		const hashedPassword = await argon2.hash(password)

		const disciplines = await this.disciplineRepository.find({
			where: createTeacherDto.disciplinesIds.map(id => ({ id }))
		})

		if (disciplines.length !== createTeacherDto.disciplinesIds.length) {
			throw new NotFoundException('Some disciplines were not found')
		}

		const teacher = this.teacherRepository.create({
			name: createTeacherDto.name,
			email: createTeacherDto.email,
			password: hashedPassword,
			disciplines
		})

		if (createTeacherDto.group) {
			const group = await this.groupRepository.findOne({
				where: { id: createTeacherDto.group }
			})

			if (!group) {
				throw new NotFoundException('Group not found')
			}

			teacher.group = group
		}

		await this.mailService.sendMail({
			to: createTeacherDto.email,
			text: `Логин: ${createTeacherDto.email}, пароль: ${password}`,
			subject: 'Данные для входа в КТК'
		})

		return await this.teacherRepository.save(teacher)
	}

	async findAll(): Promise<TeacherEntity[]> {
		return this.teacherRepository.find({ relations: ['group', 'disciplines'] })
	}

	async findWithoutGroup(): Promise<TeacherEntity[]> {
		return this.teacherRepository
			.createQueryBuilder('teacher')
			.leftJoinAndSelect('teacher.group', 'group')
			.where('group.id IS NULL')
			.getMany()
	}

	async find(id: string): Promise<TeacherEntity> {
		const teacher = await this.teacherRepository.findOne({
			where: { id },
			relations: [
				'group',
				'disciplines',
				'teachingGroups',
				'teachingGroups.chat'
			]
		})
		if (!teacher) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}
		return teacher
	}

	async update(id: string, updateTeacherDto: UpdateTeacherDto) {
		const teacher = await this.teacherRepository.findOne({
			where: { id },
			relations: ['group', 'disciplines']
		})

		if (!teacher) {
			throw new NotFoundException(`Teacher with ID ${id} not found`)
		}

		const newGroup = updateTeacherDto.group
			? await this.groupRepository.findOne({
					where: { id: updateTeacherDto.group }
				})
			: null

		const disciplineIds = updateTeacherDto.disciplinesIds ?? []
		const newDisciplines = disciplineIds.length
			? await this.disciplineRepository.findBy({ id: In(disciplineIds) })
			: []

		const { disciplinesIds, group, ...rest } = updateTeacherDto
		Object.assign(teacher, rest)

		teacher.group = newGroup ?? null
		teacher.disciplines = newDisciplines

		const savedTeacher = await this.teacherRepository.save(teacher)

		if (savedTeacher.group) {
			const schedule = await this.scheduleRepository.findOne({
				where: { group: { id: savedTeacher.group.id } },
				relations: ['group']
			})

			if (schedule) {
				schedule.monday = this.updateScheduleLessons(
					schedule.monday,
					savedTeacher
				)
				schedule.tuesday = this.updateScheduleLessons(
					schedule.tuesday,
					savedTeacher
				)
				schedule.wednesday = this.updateScheduleLessons(
					schedule.wednesday,
					savedTeacher
				)
				schedule.thursday = this.updateScheduleLessons(
					schedule.thursday,
					savedTeacher
				)
				schedule.friday = this.updateScheduleLessons(
					schedule.friday,
					savedTeacher
				)

				await this.scheduleRepository.save(schedule)
			}
		}

		return savedTeacher
	}

	async delete(id: string): Promise<DeleteResult> {
		return await this.teacherRepository.delete(id)
	}

	private updateScheduleLessons(
		lessons: Lesson[],
		teacher: TeacherEntity
	): Lesson[] {
		return lessons.map(lesson => {
			if (lesson.teacher.id === teacher.id) {
				return { ...lesson, teacher: teacher }
			}
			return lesson
		})
	}
}
