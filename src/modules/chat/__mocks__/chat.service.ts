import { chatStub } from '../test/stubs/chat.stub'
import { Types } from 'mongoose'

export const ChatService = jest.fn().mockReturnValue({
	create: jest.fn().mockResolvedValue(chatStub()),
	createRoom: jest.fn().mockResolvedValue(chatStub()),
	getAll: jest.fn().mockResolvedValue([chatStub()]),
	getUserChatsIds: jest.fn().mockResolvedValue([new Types.ObjectId()]),
	subscribeChatRoom: jest.fn().mockResolvedValue(chatStub())
})
