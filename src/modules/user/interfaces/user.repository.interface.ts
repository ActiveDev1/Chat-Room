import { BaseInterfaceRepository } from '../../../shared/interfaces/base-interface-repository.interface'
import { User } from '../schemas/user.schema'

export interface UserRepositoryInterface extends BaseInterfaceRepository<User> {
	findByIds(ids: string[]): Promise<User[]>
	findOneByUsername(username: string, selectPass?: boolean): Promise<User>
	updateOne(id: string, update: Partial<User>): Promise<User>
}
