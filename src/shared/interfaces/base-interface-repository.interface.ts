import { Document, FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose'

export interface BaseInterfaceRepository<T> {
	create<U>(data: U): Promise<T & Document>

	findById(id: string): Promise<(T & Document) | null>

	findOne(
		query: FilterQuery<T>,
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>
	): Promise<(T & Document) | null>

	find(query?: FilterQuery<T>): Promise<T[] | null>

	update(
		id: string,
		updateData: UpdateQuery<Partial<T>>,
		options?: QueryOptions<T>
	): Promise<T | null>

	delete(id: string): Promise<T | null>
}
