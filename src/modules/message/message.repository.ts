import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateMessageDto } from './dto/create-message.dto'
import { Message } from './schemas/message.schema'

@Injectable()
export class MessageRepository {
	constructor(@InjectModel(Message.name) private readonly model: Model<Message>) {}

	async create(data: CreateMessageDto): Promise<Message> {
		return await new this.model(data).save()
	}

	async findAllByChatId(chatId: string): Promise<Message[]> {
		return await this.model.find({ chat: chatId }).lean()
	}
}
