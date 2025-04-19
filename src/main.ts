import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { TelegramService } from './telegram/telegram.service'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import * as express from 'express'
import { join } from 'path'

async function bootstrap() {
	const PORT = process.env.PORT || 5000
	const app = await NestFactory.create(AppModule)

	const telegramService = app.get(TelegramService)

	app.use('/uploads', express.static(join(__dirname, '..', 'uploads')))
	app.useGlobalFilters(new AllExceptionsFilter(telegramService))
	app.enableCors({ credentials: true, origin: true })
	app.setGlobalPrefix('api')

	const config = new DocumentBuilder()
		.setTitle('KTK Dashboard')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api/docs', app, document)

	await app.listen(PORT, () =>
		console.log(`Server started http://localhost:${PORT}/api/docs`)
	)
}
void bootstrap()
