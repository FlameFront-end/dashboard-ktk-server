import {
	BadRequestException,
	Controller,
	Post,
	UploadedFiles,
	UseInterceptors
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'
import axios from 'axios'
import * as FormData from 'form-data'
import { v4 as uuidv4 } from 'uuid'

@ApiTags('upload')
@Controller('upload')
export class UploadController {
	private readonly pinataApiKey = process.env.PINATA_API_KEY
	private readonly pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY

	@Post()
	@UseInterceptors(
		FilesInterceptor('file', 10, {
			limits: { fileSize: 5 * 1024 * 1024 }
		})
	)
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'array',
					items: { type: 'string', format: 'binary' }
				}
			}
		}
	})
	async upload(@UploadedFiles() files: Express.Multer.File[]) {
		if (!files || files.length === 0) {
			throw new BadRequestException('No files were uploaded')
		}

		const uploadedUrls = []
		try {
			for (const file of files) {
				// Создаем форму для загрузки файла
				const formData = new FormData()
				formData.append('file', file.buffer, {
					filename: `${uuidv4()}_${file.originalname}`,
					contentType: file.mimetype
				})

				// Отправляем файл на Pinata
				const response = await axios.post(
					'https://api.pinata.cloud/pinning/pinFileToIPFS',
					formData,
					{
						headers: {
							...formData.getHeaders(),
							pinata_api_key: this.pinataApiKey,
							pinata_secret_api_key: this.pinataSecretApiKey
						}
					}
				)

				// Сохраняем URL загруженного файла
				uploadedUrls.push(
					`https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
				)
			}

			return { urls: uploadedUrls }
		} catch (error) {
			throw new BadRequestException(`File upload failed: ${error.message}`)
		}
	}
}
