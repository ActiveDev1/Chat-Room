import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseAbstractRepository } from '../../shared/abstracts/base.abstract.repository'
import { MessageRepositoryInterface } from './interfaces/message.repository.interface'
import { Message, MessageDocument } from './schemas/message.schema'

@Injectable()
export class MessageRepository
	extends BaseAbstractRepository<Message>
	implements MessageRepositoryInterface
{
	constructor(@InjectModel(Message.name) readonly model: Model<MessageDocument>) {
		super(model)
	}

	async findAllByChatId(chatId: string): Promise<Message[]> {
		return await this.model.find({ chat: chatId }).lean()
	}
}
