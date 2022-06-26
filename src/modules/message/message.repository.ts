import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateMessage } from './interfaces/create-message.interface'
import { Message } from './schemas/message.schema'

@Injectable()
export class MessageRepository {
	constructor(@InjectModel(Message.name) private readonly model: Model<Message>) {}

	async create(data: CreateMessage): Promise<Message> {
		const [sender, chatId] = [new Types.ObjectId(data.sender), new Types.ObjectId(data.chatId)]
		return await new this.model({ chatId, sender, content: data.content }).save()
	}

	async findAllByChatId(chatId: string): Promise<Message[]> {
		return await this.model.find({ chat: chatId }).lean()
	}
}
