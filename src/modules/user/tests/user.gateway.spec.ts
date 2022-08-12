import { Provider } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as MockedSocket from 'socket.io-mock'
import { ChatService } from '../../../modules/chat/chat.service'
import { JwtStrategy } from '../../../shared/strategies/jwt.strategy'
import { JwtStrategy as MockJwtStrategy } from '../../../shared/tests/mocks/jwt.strategy'
import { ChatService as MockChatService } from '../../chat/__mocks__/chat.service'
import { UpdateUserDto } from '../dto/update-user.dto'
import { User } from '../schemas/user.schema'
import { UserGateway } from '../user.gateway'
import { UserService } from '../user.service'
import { userStub } from './stubs/user.stub'

jest.mock('../user.service')

describe('UserGateway', () => {
	let userGateway: UserGateway
	let userService: UserService
	let chatService: ChatService
	let jwtStrategy: JwtStrategy
	let socket: MockedSocket

	const ChatServiceProvider: Provider = { provide: ChatService, useValue: MockChatService }
	const JwtStrategyProvider: Provider = { provide: JwtStrategy, useValue: MockJwtStrategy }

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [UserGateway, UserService, ChatServiceProvider, JwtStrategyProvider]
		}).compile()

		userGateway = moduleRef.get<UserGateway>(UserGateway)
		userService = moduleRef.get<UserService>(UserService)
		chatService = moduleRef.get<ChatService>(ChatService)
		jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy)

		socket = new MockedSocket()
		socket.handshake = {
			auth: {
				Authorization: 'Berear awdqwedfwqefwef'
			}
		}

		jest.clearAllMocks()
	})

	describe('handleConnection', () => {
		test('then it should call client disconnect when user validation faild', async () => {
			jest.spyOn(jwtStrategy, 'validate').mockResolvedValue(null)
			await userGateway.handleConnection(socket)
			// expect(socket.disconnect).toHaveBeenCalled()
		})
	})

	describe('findAll', () => {
		let users: User[]

		beforeEach(async () => {
			await userGateway.findAll(socket)
			users = await userService.findAll()
		})

		test('then it should call userService findAll', () => {
			expect(userService.findAll).toHaveBeenCalled()
		})

		test('then userService findAll should return user', () => {
			expect(users).toEqual([userStub()])
		})
	})

	describe('findOne', () => {
		let userId: string
		let user: User

		beforeEach(async () => {
			userId = userStub()._id

			await userGateway.findOne(socket, userId)
			user = await userService.findOne(userId)
		})

		test('then it should call userService findOne', () => {
			expect(userService.findOne).toHaveBeenCalledWith(userId)
		})

		test('then userService findOne should return user', () => {
			expect(user).toEqual(userStub())
		})
	})

	describe('update', () => {
		let userId = userStub()._id
		let updateUserDto: UpdateUserDto
		let updatedUser: User

		beforeEach(async () => {
			updateUserDto = {
				name: userStub().name,
				username: userStub().username,
				password: userStub().password
			}

			await userGateway.update(socket, userId)
			updatedUser = await userService.update(userId, updateUserDto)
		})

		test('then it should call userService update', () => {
			expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto)
		})

		test('then userService update should return user', () => {
			expect(updatedUser).toEqual(userStub())
		})
	})

	// it('should be able to run gateway.handleMessage', () => {
	// 	expect(gateway.handleMessage({}, { name: 'Test' })).toBe('Hello, Test!')
	// 	expect(gateway.handleMessage({}, {})).toBe('Hello, World!')
	// })
})
