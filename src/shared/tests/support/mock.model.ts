import { Document } from 'mongoose'
import { BaseInterfaceRepository } from '../../interfaces/base-interface-repository.interface'

export abstract class MockModel<T> implements BaseInterfaceRepository<T> {
	protected abstract entityStub: T & Document

	constructor(createEntityData: T) {
		this.constructorSpy(createEntityData)
	}

	constructorSpy(_createEntityData: T): void {}

	async create(): Promise<T & Document> {
		return this.entityStub
	}

	async findById(): Promise<T & Document> {
		return this.entityStub
	}

	async findOne(): Promise<T & Document> {
		return this.entityStub
	}

	async find(): Promise<T[]> {
		return [this.entityStub]
	}

	async update(): Promise<T> {
		return this.entityStub
	}

	async delete(): Promise<T> {
		return this.entityStub
	}
}
