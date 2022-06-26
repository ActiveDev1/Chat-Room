import { Type } from 'class-transformer'
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'

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
