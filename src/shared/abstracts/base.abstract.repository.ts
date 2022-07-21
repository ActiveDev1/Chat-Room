import { Document, FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose'
import { BaseInterfaceRepository } from '../interfaces/base-interface-repository.interface'

export abstract class BaseAbstractRepository<T> implements BaseInterfaceRepository<T> {
	protected constructor(protected readonly model: Model<T & Document>) {}

	async create<U>(data: U): Promise<T & Document> {
		return await new this.model(data).save()
	}

	async findById(id: string): Promise<(T & Document) | null> {
		return await this.model.findById(id)
	}

	async findOne(
		query: FilterQuery<T>,
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>
	): Promise<(T & Document) | null> {
		return await this.model.findOne(query, projection, options)
	}

	async find(query?: FilterQuery<T>): Promise<T[] | null> {
		return await this.model.find(query, {}, { lean: true })
	}

	async update(
		id: string,
		updateData: UpdateQuery<Partial<T>>,
		options?: QueryOptions<T>
	): Promise<T | null> {
		return await this.model.findByIdAndUpdate(id, updateData, { ...options, new: true })
	}

	async delete(id: string): Promise<T | null> {
		return await this.model.findByIdAndDelete(id)
	}
}
