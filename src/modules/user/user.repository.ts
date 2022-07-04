import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseAbstractRepository } from '../../shared/abstracts/base.abstract.repository'
import { UserRepositoryInterface } from './interfaces/user.repository.interface'
import { User } from './schemas/user.schema'

@Injectable()
export class UserRepository
	extends BaseAbstractRepository<User>
	implements UserRepositoryInterface
{
	constructor(@InjectModel(User.name) readonly model: Model<User>) {
		super(model)
	}

	async findByIds(ids: string[]): Promise<User[]> {
		return await this.model.find({ _id: { $in: ids } }).lean()
	}

	async findOneByUsername(username: string, selectPass: boolean = false): Promise<User> {
		return await this.model
			.findOne({ username })
			.select(`${selectPass ? '+password' : ''}`)
			.lean()
	}

	async updateOne(id: string, update: Partial<User>): Promise<User> {
		return await this.model.findByIdAndUpdate(id, update).lean()
	}
}
