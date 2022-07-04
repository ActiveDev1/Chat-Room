import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { WebsocketExceptionsFilter } from '../../shared/filters/ws-exception.filter'
import { Socket } from '../../shared/interfaces/socket.interface'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { MessageService } from './message.service'

@WebSocketGateway()
@UsePipes(new ValidationPipe())
@UseFilters(WebsocketExceptionsFilter)
export class MessageGateway {
	@WebSocketServer()
	server: Server

	constructor(private readonly messageService: MessageService) {}
	chatIdPrefix = 'chat:'

	@SubscribeMessage('message:send')
	async send(@ConnectedSocket() client: Socket, @MessageBody() body: CreateMessageDto) {
		const message = await this.messageService.create(client.userId, body)
		if (message) {
			this.server.to(this.chatIdPrefix + body.chatId).emit('message:new', message)
		}
	}

	@SubscribeMessage('findAllMessage')
	findAll() {
		return this.messageService.findAll()
	}

	@SubscribeMessage('findOneMessage')
	findOne(@MessageBody() id: number) {
		return this.messageService.findOne(id)
	}

	@SubscribeMessage('updateMessage')
	update(@MessageBody() updateMessageDto: UpdateMessageDto) {
		return this.messageService.update(updateMessageDto.id, updateMessageDto)
	}

	@SubscribeMessage('removeMessage')
	remove(@MessageBody() id: number) {
		return this.messageService.remove(id)
	}
}
