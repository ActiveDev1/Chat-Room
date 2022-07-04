import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { BaseAbstractRepository } from '../../shared/abstracts/base.abstract.repository'
import { ChatRepositoryInterface } from './interfaces/chat.repository.interface'
import { Chat } from './schemas/chat.schema'

@Injectable()
export class ChatRepository
	extends BaseAbstractRepository<Chat>
	implements ChatRepositoryInterface
{
	constructor(@InjectModel(Chat.name) readonly model: Model<Chat>) {
		super(model)
	}

	async findByPublicId(publicId: string): Promise<Chat> {
		return await this.model.findOne({ 'room.publicId': publicId }).lean()
	}

	async findOneByUsersIds(usersIds: string[]): Promise<Chat> {
		return await this.model.findOne({ users: { $in: usersIds }, room: null }).lean()
	}

	async findAllByUserId(userId: string): Promise<Chat[]> {
		return await this.model
			.aggregate()
			.match({ users: { $in: [new Types.ObjectId(userId)] } })
			.project({ id: 1, latestMessage: 1, room: { name: 1 } })
	}

	async pushIdToUsers(id: string, userId: string): Promise<Chat> {
		return await this.model
			.findByIdAndUpdate(id, { $addToSet: { users: userId } }, { new: true })
			.lean()
	}

	async updateLastestMessage(id: string, messageId: string): Promise<Chat> {
		return await this.model
			.findByIdAndUpdate(id, { $set: { latestMessage: messageId } }, { new: true })
			.lean()
	}
}
