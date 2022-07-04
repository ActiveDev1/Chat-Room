export interface BaseInterfaceRepository<T> {
	create(data: T | any): Promise<T>

	findById(id: string): Promise<T>

	findAll(): Promise<T[]>

	deleteOne(id: string): Promise<T>
}
