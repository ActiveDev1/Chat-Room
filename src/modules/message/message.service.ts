import { Injectable } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { MessageRepository } from './message.repository'

@Injectable()
export class MessageService {
	constructor(private readonly messageRepository: MessageRepository) {}

	async create(createMessageDto: CreateMessageDto) {
		return await this.messageRepository.create(createMessageDto)
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
