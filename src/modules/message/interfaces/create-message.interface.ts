import { CreateMessageDto } from '../dto/create-message.dto'

export interface CreateMessage extends CreateMessageDto {
	sender: string
}
