import { IsString } from 'class-validator'

export class SubscribeChatRoomDto {
	@IsString()
	publicId: string
}
