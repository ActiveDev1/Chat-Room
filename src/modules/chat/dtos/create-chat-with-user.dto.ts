import { IsNotEmpty, IsString } from 'class-validator'

export class CreateChatWithUserDto {
	@IsString()
	@IsNotEmpty()
	username: string
}
