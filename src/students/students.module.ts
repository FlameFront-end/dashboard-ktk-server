import { Module } from '@nestjs/common'
import { StudentsService } from './students.service'
import { StudentsController } from './students.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudentEntity } from './entities/student.entity'
import { MailModule } from '../mail/mail.module'
import { AuthModule } from '../auth/auth.module'

@Module({
	imports: [MailModule, AuthModule, TypeOrmModule.forFeature([StudentEntity])],
	controllers: [StudentsController],
	providers: [StudentsService]
})
export class StudentsModule {}
