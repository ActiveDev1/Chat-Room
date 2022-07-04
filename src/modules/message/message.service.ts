import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ChatRepositoryInterface } from '../chat/interfaces/chat.repository.interface'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { CreateMessage } from './interfaces/create-message.interface'
import { MessageRepositoryInterface } from './interfaces/message.repository.interface'

@Injectable()
export class MessageService {
	constructor(
		@Inject('MessageRepository')
		private readonly messageRepository: MessageRepositoryInterface,
		@Inject('ChatRepository')
		private readonly chatRepository: ChatRepositoryInterface
	) {}

	async create(senderId: string, createMessageDto: CreateMessageDto) {
		const chat = await this.chatRepository.findById(createMessageDto.chatId)
		if (!chat) {
			throw new NotFoundException('Chat not found')
		}

		const message = await this.messageRepository.create<CreateMessage>({
			sender: senderId,
			...createMessageDto
		})

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
