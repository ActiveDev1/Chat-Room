import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseAbstractRepository } from '../../shared/abstracts/base.abstract.repository'
import { UserRepositoryInterface } from './interfaces/user.repository.interface'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UserRepository
	extends BaseAbstractRepository<User>
	implements UserRepositoryInterface
{
	constructor(@InjectModel(User.name) readonly model: Model<UserDocument>) {
		super(model)
	}

	async findByIds(ids: string[]): Promise<UserDocument[]> {
		return await this.model.find({ _id: { $in: ids } })
	}

	async findOneByUsername(username: string): Promise<UserDocument> {
		return await this.model.findOne({ username })
	}

	async updateOne(id: string, update: Partial<User>): Promise<User> {
		return await super.update(id, { $set: update })
	}
}
