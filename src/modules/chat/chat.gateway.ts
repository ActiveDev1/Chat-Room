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
import { SubscribeChatRoomDto } from './dtos/subscribe-chat-room-dto'

@WebSocketGateway()
@UsePipes(new ValidationPipe())
@UseFilters(WebsocketExceptionsFilter)
export class ChatGateway {
	constructor(private readonly chatService: ChatService) {}
	chatIdPrefix = 'chat:'

	@SubscribeMessage('chat:createWithUser')
	async createWithUser(
		@ConnectedSocket() client: Socket,
		@MessageBody() body: CreateChatWithUserDto
	) {
		const chat = await this.chatService.create(client.userId, body)
		client.emit('chat:newUser', chat)
		client.join(this.chatIdPrefix + chat._id)
	}

	@SubscribeMessage('chat:createRoom')
	async createRoom(@ConnectedSocket() client: Socket, @MessageBody() body: CreateChatRoomDto) {
		const chat = await this.chatService.createRoom(client.userId, body)
		client.emit('chat:newRoom', chat)
		client.join(this.chatIdPrefix + chat._id)
	}

	@SubscribeMessage('chat:getAll')
	async getAll(@ConnectedSocket() client: Socket) {
		const chat = await this.chatService.getAll(client.userId)
		client.emit('chat:getChats', chat)
	}

	@SubscribeMessage('chat:subscribe')
	async subscribe(@ConnectedSocket() client: Socket, @MessageBody() body: SubscribeChatRoomDto) {
		const chat = await this.chatService.subscribeChatRoom(client.userId, body.publicId)
		client.emit('chat:newRoom', chat)
		client.join(this.chatIdPrefix + chat._id)
	}
}
