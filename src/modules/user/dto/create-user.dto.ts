import { IsString, IsNotEmpty, Length } from 'class-validator'
import { User } from '../schemas/user.schema'

export class CreateUserDto implements User {
	@IsString()
	@IsNotEmpty()
	@Length(3, 45)
	name: string

	@IsString()
	@IsNotEmpty()
	@Length(3, 20)
	username: string

	@IsString()
	@IsNotEmpty()
	@Length(6, 30)
	password: string
}
