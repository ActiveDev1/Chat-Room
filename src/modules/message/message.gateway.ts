import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { WebsocketExceptionsFilter } from 'src/shared/filters/ws-exception.filter'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { MessageService } from './message.service'

@WebSocketGateway()
@UsePipes(new ValidationPipe())
@UseFilters(WebsocketExceptionsFilter)
export class MessageGateway {
	constructor(private readonly messageService: MessageService) {}

	@SubscribeMessage('message:send')
	async send(@ConnectedSocket() client: Socket, @MessageBody() body: CreateMessageDto) {
		// const message = await this.messageService.create(body)
		// client.emit()
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
