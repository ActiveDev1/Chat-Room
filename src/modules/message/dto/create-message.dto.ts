import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { Type } from 'class-transformer'

class MessageContentDto {
	@IsString()
	@IsNotEmpty()
	text: string
}

export class CreateMessageDto {
	@IsMongoId()
	chatId: string

	@Type(() => MessageContentDto)
	content: MessageContentDto
}
