import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from './auth/auth.module'
import { UploadModule } from './upload/upload.module'
import { MailModule } from './mail/mail.module'
import { TeachersModule } from './teachers/teachers.module'
import { TeacherEntity } from './teachers/entities/teacher.entity'
import { StudentsModule } from './students/students.module'
import { StudentEntity } from './students/entities/student.entity'
import { GroupsModule } from './groups/groups.module'
import { GroupEntity } from './groups/entities/group.entity'
import { ScheduleEntity } from './groups/entities/schedule.entity'
import { AdminsModule } from './admins/admins.module'
import { AdminEntity } from './admins/entities/admin.entity'
import { DisciplinesModule } from './disciplines/disciplines.module'
import { DisciplineEntity } from './disciplines/entities/discipline.entity'
import { GradeEntity } from './groups/entities/grade.entity'
import { LessonsModule } from './lessons/lessons.module'
import { LessonEntity } from './lessons/entities/lesson.entity'
import { ChatModule } from './chat/chat.module'
import { MessagesModule } from './messages/messages.module'
import { MessageEntity } from './messages/entities/message.entity'
import { ChatEntity } from './chat/entities/chat.entity'
import { ChatGateway } from './chat/chat.gateway'

@Module({
	imports: [
		AuthModule,
		UploadModule,
		MailModule,
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env.NODE_ENV}`
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: Number(process.env.POSTGRESS_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRESS_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: [
				TeacherEntity,
				StudentEntity,
				GroupEntity,
				ScheduleEntity,
				AdminEntity,
				DisciplineEntity,
				GradeEntity,
				LessonEntity,
				MessageEntity,
				ChatEntity
			],
			synchronize: true,
			ssl:
				process.env.NODE_ENV === 'development'
					? false
					: { rejectUnauthorized: true }
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: { expiresIn: '30d' }
			}),
			inject: [ConfigService]
		}),
		TypeOrmModule.forFeature([
			TeacherEntity,
			StudentEntity,
			GroupEntity,
			ScheduleEntity,
			AdminEntity,
			DisciplineEntity,
			GradeEntity,
			LessonEntity,
			MessageEntity,
			ChatEntity
		]),
		TeachersModule,
		StudentsModule,
		GroupsModule,
		AdminsModule,
		DisciplinesModule,
		LessonsModule,
		LessonEntity,
		ChatModule,
		MessagesModule
	],
	providers: []
})
export class AppModule {}
