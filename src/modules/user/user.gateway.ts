import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway
} from '@nestjs/websockets'
import { WebsocketExceptionsFilter } from 'src/shared/filters/ws-exception.filter'
import { Socket } from '../../shared/interfaces/socket.interface'
import { JwtStrategy } from '../../shared/strategies/jwt.strategy'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@WebSocketGateway()
@UsePipes(new ValidationPipe())
@UseFilters(WebsocketExceptionsFilter)
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly userService: UserService,
		private readonly jwtStrategy: JwtStrategy
	) {}

	async handleConnection(client: Socket) {
		try {
			const user = await this.jwtStrategy.validate(
				client.handshake.auth.Authorization.replace('Bearer ', '')
			)
			if (user) {
				client.userId = user._id.toString()
				await this.userService.setOnline({ userId: user.id, socketId: client.id })
			} else client.disconnect(true)
		} catch (error) {
			client.disconnect(true)
		}
	}

	async handleDisconnect(client: Socket) {
		await this.userService.setOffline({ userId: client.userId, socketId: client.id })
	}

	@SubscribeMessage('user:findAll')
	async findAll(@ConnectedSocket() client: Socket) {
		const users = await this.userService.findAll()
		client.emit('user:getAll', users)
	}

	@SubscribeMessage('user:findOne')
	async findOne(@ConnectedSocket() client: Socket, @MessageBody() id: string) {
		const user = await this.userService.findOne(id)
		client.emit('user:getOne', user)
	}

	@SubscribeMessage('user:update')
	async update(@ConnectedSocket() client: Socket, @MessageBody() updateUserDto: UpdateUserDto) {
		const user = await this.userService.update(
			{ userId: client.userId, socketId: client.id },
			updateUserDto
		)
		client.emit('user:updated', user)
	}
}
