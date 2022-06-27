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
import { ChatService } from '../chat/chat.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@WebSocketGateway()
@UsePipes(new ValidationPipe())
@UseFilters(WebsocketExceptionsFilter)
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly userService: UserService,
		private readonly chatService: ChatService,
		private readonly jwtStrategy: JwtStrategy
	) {}

	async handleConnection(client: Socket) {
		try {
			const user = await this.jwtStrategy.validate(
				client.handshake.auth.Authorization.replace('Bearer ', '')
			)
			if (user) {
				const userId = user._id.toString()
				client.userId = userId
				await this.userService.setOnline(userId, client.id)
				const chatsIds = await this.chatService.getUserChatsIds(user._id)
				client.join(chatsIds)
			} else client.disconnect(true)
		} catch (error) {
			client.disconnect(true)
		}
	}

	async handleDisconnect(client: Socket) {
		await this.userService.setOffline(client.userId)
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
		const user = await this.userService.update(client.userId, updateUserDto)
		client.emit('user:updated', user)
	}
}
