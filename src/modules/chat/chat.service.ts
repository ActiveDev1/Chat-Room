import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common'
import mongoose from 'mongoose'
import { generateRandomString } from 'src/shared/utils/functions'
import { UserRepository } from '../user/user.repository'
import { ChatRepository } from './chat.repository'
import { CreateChatRoomDto } from './dtos/create-chat-room.dto'
import { CreateChatWithUserDto } from './dtos/create-chat-with-user.dto'
import { CreateChat } from './interfaces/create-chat.interface'
import { Chat } from './schemas/chat.schema'

@Injectable()
export class ChatService {
	chatIdPrefix = 'chat-'

	constructor(
		private readonly chatRepository: ChatRepository,
		private readonly userRepository: UserRepository
	) {}

	async create(creatorId: string, { username }: CreateChatWithUserDto): Promise<Chat> {
		const user = await this.userRepository.findOneByUsername(username)
		if (!user) {
			throw new NotFoundException('User not found')
		}

		const usersIds = [new mongoose.Types.ObjectId(creatorId), user._id]
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

	async getChatsIds(userId: string): Promise<string[]> {
		const chats = await this.chatRepository.findAllByUserId(userId)
		return chats.map((chat) => this.chatIdPrefix + chat._id.toString())
	}
}
