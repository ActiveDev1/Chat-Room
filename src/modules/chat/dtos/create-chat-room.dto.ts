import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateChatRoomDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsOptional()
	publicId: string

	@IsMongoId({ each: true })
	usersIds: string[]

	@IsBoolean()
	@IsOptional()
	isPrivate: boolean
}
