import { AuthController } from '../auth.controller'
import { Test } from '@nestjs/testing'
import { AuthService } from '../auth.service'
import { Tokens } from '../interfaces/token.interface'
import { CreateUserDto } from '../dtos/create-user.dto'
import { LoginDto } from '../dtos/login.dto'
import { userStub } from './stubs/user.stub'
import { authStub } from './stubs/auth.stub'

jest.mock('../auth.service')

describe('AuthController', () => {
	let authController: AuthController
	let authService: AuthService

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService]
		}).compile()

		authController = moduleRef.get<AuthController>(AuthController)
		authService = moduleRef.get<AuthService>(AuthService)

		jest.clearAllMocks()
	})

	describe('signup', () => {
		describe('when signup is called', () => {
			let tokens: Tokens
			let createUserDto: CreateUserDto

			beforeEach(async () => {
				createUserDto = userStub()
				tokens = await authController.signup(createUserDto)
			})

			test('then it should call authService signup', () => {
				expect(authService.signup).toHaveBeenCalledWith(createUserDto)
			})

			test('then it should return tokens', () => {
				expect(tokens).toEqual(authStub())
			})
		})
	})
	describe('signin', () => {
		describe('when signin is called', () => {
			let tokens: Tokens
			let LoginDto: LoginDto

			beforeEach(async () => {
				LoginDto = {
					username: userStub().username,
					password: userStub().password
				}
				tokens = await authController.signin(LoginDto)
			})

			test('then it should call authService login', () => {
				expect(authService.login).toHaveBeenCalledWith(LoginDto)
			})

			test('then it should return tokens', () => {
				expect(tokens).toEqual(authStub())
			})
		})
	})
})
