import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UserRepository {
	constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

	async create(data: CreateUserDto): Promise<User> {
		return await this.model.create(new this.model(data))
	}

	async findAll(): Promise<User[]> {
		return await this.model.find().lean()
	}

	async findById(id: string): Promise<User> {
		return this.model.findOne({ _id: id }).lean()
	}

	async findOneByUsername(username: string): Promise<User> {
		return this.model.findOne({ username }).lean()
	}

	async delete(id: string) {
		return await this.model.findByIdAndRemove({ _id: id })
	}
}
