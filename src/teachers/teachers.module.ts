import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeachersService } from './teachers.service'
import { TeachersController } from './teachers.controller'
import { TeacherEntity } from './entities/teacher.entity'
import { MailModule } from '../mail/mail.module'
import { UserEntity } from '../user/entities/user.entity'
import { UserModule } from '../user/user.module'

@Module({
	imports: [
		MailModule,
		UserModule,
		TypeOrmModule.forFeature([TeacherEntity, UserEntity])
	],
	controllers: [TeachersController],
	providers: [TeachersService]
})
export class TeachersModule {}
