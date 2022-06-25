import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Chat } from './schemas/chat.schema'

@Injectable()
export class ChatRepository {
	constructor(@InjectModel(Chat.name) private readonly model: Model<Chat>) {}

	async create(users: string[]): Promise<Chat> {
		return await new this.model({ users }).save()
	}
}
