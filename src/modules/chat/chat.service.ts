import { Injectable, NotFoundException } from '@nestjs/common'
import { UserRepository } from '../user/user.repository'
import { ChatRepository } from './chat.repository'
import { CreateChatWithUserDto } from './dtos/create-chat-with-user.dto'

@Injectable()
export class ChatService {
	constructor(
		private readonly chatRepository: ChatRepository,
		private readonly userRepository: UserRepository
	) {}

	async create(creatorId: string, { username }: CreateChatWithUserDto) {
		const user = await this.userRepository.findOneByUsername(username)
		if (!user) {
			throw new NotFoundException('User not found')
		}

		return await this.chatRepository.create([creatorId, user.id])
	}
}
