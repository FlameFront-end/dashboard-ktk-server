import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeachersService } from './teachers.service'
import { TeachersController } from './teachers.controller'
import { TeacherEntity } from './entities/teacher.entity'
import { MailModule } from '../mail/mail.module'
import { AuthModule } from '../auth/auth.module'

@Module({
	imports: [MailModule, AuthModule, TypeOrmModule.forFeature([TeacherEntity])],
	controllers: [TeachersController],
	providers: [TeachersService]
})
export class TeachersModule {}
