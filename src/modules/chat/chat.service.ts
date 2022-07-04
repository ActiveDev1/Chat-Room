import { Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common'
import { generateRandomString } from 'src/shared/utils/functions'
import { UserRepositoryInterface } from '../user/interfaces/user.repository.interface'
import { ChatRepository } from './chat.repository'
import { CreateChatRoomDto } from './dtos/create-chat-room.dto'
import { CreateChatWithUserDto } from './dtos/create-chat-with-user.dto'
import { CreateChat } from './interfaces/create-chat.interface'
import { Chat } from './schemas/chat.schema'

@Injectable()
export class ChatService {
	chatIdPrefix = 'chat:'

	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepositoryInterface,
		private readonly chatRepository: ChatRepository
	) {}

	async create(creatorId: string, { username }: CreateChatWithUserDto): Promise<Chat> {
		const user = await this.userRepository.findOneByUsername(username)
		if (!user) {
			throw new NotFoundException('User not found')
		}

		const usersIds = [creatorId, user._id]
		const chat = await this.chatRepository.findOneByUsersIds(usersIds)

		if (chat) {
			throw new NotAcceptableException('Chat with this user is available')
		}

		return await this.chatRepository.create({ users: usersIds })
	}

	async createRoom(creatorId: string, createChatRoomDto: CreateChatRoomDto): Promise<Chat> {
		const { name, publicId, isPrivate } = createChatRoomDto
		const users = await this.userRepository.findByIds(createChatRoomDto.usersIds)
		const usersIds = [...users.map((user) => user._id.toString() as string), creatorId]

		if (publicId) {
			const room = await this.chatRepository.findByPublicId(publicId)
			if (room) {
				throw new NotAcceptableException('Chat room with this ID is available')
			}
		}

		const newChat: CreateChat = {
			users: usersIds,
			room: { name, publicId: publicId || generateRandomString(), isPrivate }
		}
		return await this.chatRepository.create(newChat)
	}

	async getAll(userId: string): Promise<Chat[]> {
		return await this.chatRepository.findAllByUserId(userId)
	}

	async getUserChatsIds(userId: string): Promise<string[]> {
		const chats = await this.chatRepository.findAllByUserId(userId)
		return chats.map((chat) => this.chatIdPrefix + chat._id.toString())
	}

	async subscribeChatRoom(userId: string, publicId: string) {
		const chat = await this.chatRepository.findByPublicId(publicId)
		if (!chat) {
			throw new NotFoundException('Chat room with this ID is no available')
		}
		return await this.chatRepository.pushIdToUsers(chat._id, userId)
	}
}
