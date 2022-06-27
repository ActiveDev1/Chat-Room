import { Injectable, NotFoundException } from '@nestjs/common'
import { ChatRepository } from '../chat/chat.repository'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { MessageRepository } from './message.repository'

@Injectable()
export class MessageService {
	constructor(
		private readonly messageRepository: MessageRepository,
		private readonly chatRepository: ChatRepository
	) {}

	async create(senderId: string, createMessageDto: CreateMessageDto) {
		const chat = await this.chatRepository.findById(createMessageDto.chatId)
		if (!chat) {
			throw new NotFoundException('Chat not found')
		}

		const message = await this.messageRepository.create({ sender: senderId, ...createMessageDto })
		await this.chatRepository.updateLastestMessage(chat._id, message._id)
		return message
	}

	findAll() {
		return `This action returns all message`
	}

	findOne(id: number) {
		return `This action returns a #${id} message`
	}

	update(id: number, updateMessageDto: UpdateMessageDto) {
		return `This action updates a #${id} message`
	}

	remove(id: number) {
		return `This action removes a #${id} message`
	}
}
