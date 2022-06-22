import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@WebSocketGateway()
export class UserGateway {
	constructor(private readonly userService: UserService) {}

	@SubscribeMessage('createUser')
	async create(@MessageBody() createUserDto: CreateUserDto) {
		return await this.userService.create(createUserDto)
	}

	@SubscribeMessage('findAllUser')
	findAll() {
		return this.userService.findAll()
	}

	@SubscribeMessage('findOneUser')
	findOne(@MessageBody() id: number) {
		return this.userService.findOne(id)
	}

	@SubscribeMessage('updateUser')
	update(@MessageBody() updateUserDto: UpdateUserDto) {
		return this.userService.update(updateUserDto.id, updateUserDto)
	}

	@SubscribeMessage('removeUser')
	remove(@MessageBody() id: number) {
		return this.userService.remove(id)
	}
}
