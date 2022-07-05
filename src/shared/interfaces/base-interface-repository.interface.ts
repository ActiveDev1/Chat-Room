import { Document, FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose'

export interface BaseInterfaceRepository<T> {
	create<U>(data: U): Promise<T & Document>

	findById(id: string): Promise<T & Document>

	findOne(
		query: FilterQuery<T>,
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>
	): Promise<T>

	findAll(): Promise<T[]>

	update(id: string, updateData: UpdateQuery<Partial<T>>, options?: QueryOptions<T>): Promise<T>

	delete(id: string): Promise<T>
}
