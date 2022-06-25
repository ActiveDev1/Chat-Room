import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway
} from '@nestjs/websockets'
import { Socket } from '../../shared/interfaces/socket.interface'
import { ChatService } from './chat.service'
import { CreateChatRoomDto } from './dtos/create-chat-room.dto'
import { CreateChatWithUserDto } from './dtos/create-chat-with-user.dto'

@WebSocketGateway()
export class ChatGateway {
	constructor(private readonly chatService: ChatService) {}

	@SubscribeMessage('chat:create-with-user')
	async createWithUser(
		@ConnectedSocket() client: Socket,
		@MessageBody() body: CreateChatWithUserDto
	) {
		const message = await this.chatService.create(client.userId, body)
		client.emit('chat:new-user', message)
	}

	@SubscribeMessage('chat:create-room')
	async createRoom(@ConnectedSocket() client: Socket, @MessageBody() body: CreateChatRoomDto) {}
}
