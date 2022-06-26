import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway
} from '@nestjs/websockets'
import { WebsocketExceptionsFilter } from '../../shared/filters/ws-exception.filter'
import { Socket } from '../../shared/interfaces/socket.interface'
import { ChatService } from './chat.service'
import { CreateChatRoomDto } from './dtos/create-chat-room.dto'
import { CreateChatWithUserDto } from './dtos/create-chat-with-user.dto'

@WebSocketGateway()
@UsePipes(new ValidationPipe())
@UseFilters(WebsocketExceptionsFilter)
export class ChatGateway {
	constructor(private readonly chatService: ChatService) {}
	chatIdPrefix = 'chat-'

	@SubscribeMessage('chat:createWithUser')
	async createWithUser(
		@ConnectedSocket() client: Socket,
		@MessageBody() body: CreateChatWithUserDto
	) {
		const message = await this.chatService.create(client.userId, body)
		client.emit('chat:newUser', message)
		client.join(this.chatIdPrefix + message._id)
	}

	@SubscribeMessage('chat:createRoom')
	async createRoom(@ConnectedSocket() client: Socket, @MessageBody() body: CreateChatRoomDto) {
		const message = await this.chatService.createRoom(client.userId, body)
		client.emit('chat:newRoom', message)
		client.join(this.chatIdPrefix + message._id)
	}

	@SubscribeMessage('chat:subscribe')
	async subscribe(@ConnectedSocket() client: Socket, @MessageBody() body: string) {
		client.join(this.chatIdPrefix + body)
	}
}
