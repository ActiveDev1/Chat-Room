import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from '../auth/dtos/create-user.dto'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UserRepository {
	constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

	async create(data: CreateUserDto): Promise<UserDocument> {
		return await new this.model(data).save()
	}

	async findAll(): Promise<UserDocument[]> {
		return await this.model.find().lean()
	}

	async findById(id: string): Promise<UserDocument> {
		return await this.model.findById(id)
	}

	async findOneByUsername(username: string, selectPass: boolean = false): Promise<UserDocument> {
		return await this.model
			.findOne({ username })
			.select(`${selectPass ? '+password' : ''}`)
			.lean()
	}

	async updateOne(id: string, update: Partial<User>): Promise<UserDocument> {
		return await this.model.findByIdAndUpdate({ _id: id }, update).lean()
	}
}
