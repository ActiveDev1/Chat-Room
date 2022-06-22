import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UserRepository {
	constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		return await this.userModel.create(createUserDto)
	}

	async findAll(): Promise<User[]> {
		return await this.userModel.find()
	}

	async findOne(id: string): Promise<User> {
		return this.userModel.findOne({ _id: id })
	}

	async delete(id: string) {
		return await this.userModel.findByIdAndRemove({ _id: id })
	}
}
