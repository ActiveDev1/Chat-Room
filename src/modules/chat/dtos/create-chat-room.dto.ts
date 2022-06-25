import { IsNotEmpty, IsString } from 'class-validator'

export class CreateChatRoomDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsNotEmpty()
	roomId: string
}
