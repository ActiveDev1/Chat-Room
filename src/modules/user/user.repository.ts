import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from '../auth/dtos/create-user.dto'
import { User } from './schemas/user.schema'

@Injectable()
export class UserRepository {
	constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

	async create(data: CreateUserDto): Promise<User> {
		return await new this.model(data).save()
	}

	async findAll(): Promise<User[]> {
		return await this.model.find().lean()
	}

	async findById(id: string): Promise<User> {
		return await this.model.findById(id).lean()
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
