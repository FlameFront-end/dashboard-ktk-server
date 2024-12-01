import { Module } from '@nestjs/common'
import { AdminsService } from './admins.service'
import { AdminsController } from './admins.controller'
import { MailModule } from '../mail/mail.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminEntity } from './entities/admin.entity'
import { AuthModule } from '../auth/auth.module'

@Module({
	imports: [MailModule, AuthModule, TypeOrmModule.forFeature([AdminEntity])],
	controllers: [AdminsController],
	providers: [AdminsService]
})
export class AdminsModule {}
