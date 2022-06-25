import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway
} from '@nestjs/websockets'
import { Socket } from '../../shared/interfaces/socket.interface'
import { JwtStrategy } from '../../shared/strategies/jwt.strategy'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly userService: UserService,
		private readonly jwtStrategy: JwtStrategy
	) {}

	async handleConnection(client: Socket) {
		try {
			const user = await this.jwtStrategy.validate(
				client.handshake.headers.authorization.replace('Bearer ', '')
			)
			if (user) {
				client.userId = user.id
				await this.userService.setOnline({ userId: user.id, socketId: client.id })
			} else client.disconnect(true)
		} catch (error) {
			client.disconnect(true)
		}
	}

	async handleDisconnect(client: Socket) {
		await this.userService.setOffline({ userId: client.userId, socketId: client.id })
	}

	@SubscribeMessage('findAllUser')
	async findAll(@ConnectedSocket() client: Socket) {
		const users = await this.userService.findAll()
		client.emit('users', users)
	}

	@SubscribeMessage('findOneUser')
	async findOne(@ConnectedSocket() client: Socket, @MessageBody() id: string) {
		const user = await this.userService.findOne(id)
		client.emit('user', user)
	}

	@SubscribeMessage('updateUser')
	async update(@ConnectedSocket() client: Socket, @MessageBody() updateUserDto: UpdateUserDto) {
		const user = await this.userService.update(client.userId, updateUserDto)
		client.emit('updeatedUser', user)
	}
}
