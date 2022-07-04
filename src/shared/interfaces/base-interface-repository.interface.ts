export interface BaseInterfaceRepository<T> {
	create<U>(data: U): Promise<T>

	findById(id: string): Promise<T>

	findAll(): Promise<T[]>

	deleteOne(id: string): Promise<T>
}
