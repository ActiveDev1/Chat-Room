import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateChat } from './interfaces/create-chat.interface'
import { Chat } from './schemas/chat.schema'

@Injectable()
export class ChatRepository {
	constructor(@InjectModel(Chat.name) private readonly model: Model<Chat>) {}

	async create(data: CreateChat): Promise<Chat> {
		return await new this.model(data).save()
	}

	async findByPublicId(publicId: string): Promise<Chat> {
		return await this.model.findOne({ room: { publicId } }).lean()
	}

	async findOneByUsersIds(usersIds: string[]): Promise<Chat> {
		return await this.model.findOne({ users: { $in: usersIds }, room: null }).lean()
	}

	async findAllByUserId(userId: string): Promise<Chat[]> {
		return await this.model.find({ users: { $in: [userId] } }).lean()
	}
}
