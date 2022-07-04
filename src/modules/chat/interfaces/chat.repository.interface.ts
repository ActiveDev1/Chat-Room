import { BaseInterfaceRepository } from '../../../shared/interfaces/base-interface-repository.interface'
import { Chat } from '../schemas/chat.schema'

export interface ChatRepositoryInterface extends BaseInterfaceRepository<Chat> {
	findByPublicId(publicId: string): Promise<Chat>

	findOneByUsersIds(usersIds: string[]): Promise<Chat>

	findAllByUserId(userId: string): Promise<Chat[]>

	pushIdToUsers(id: string, userId: string): Promise<Chat>

	updateLastestMessage(id: string, messageId: string): Promise<Chat>
}
