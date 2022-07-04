import { Model, Document } from 'mongoose'
import { BaseInterfaceRepository } from '../interfaces/base-interface-repository.interface'

export abstract class BaseAbstractRepository<T extends Document>
	implements BaseInterfaceRepository<T>
{
	protected constructor(protected readonly model: Model<T>) {}

	async create(data: T | any): Promise<T> {
		return await new this.model(data).save()
	}

	async findById(id: string): Promise<T> {
		return await this.model.findById(id)
	}

	async findAll(): Promise<T[]> {
		return await this.model.find()
	}

	async deleteOne(id: string): Promise<T> {
		return await this.model.findByIdAndDelete(id)
	}
}
