import { ForbiddenException, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserDocument } from 'src/modules/user/schemas/user.schema'
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface'
import { JwtConfig } from '../../../config/configuration'
import { UserRepository } from '../../../modules/user/user.repository'
import * as argon from '../../../shared/utils/argon2/argon'
import { userStub as userDocumentStub } from '../../user/tests/stubs/user.stub'
import { AuthService } from '../auth.service'
import { CreateUserDto } from '../dtos/create-user.dto'
import { LoginDto } from '../dtos/login.dto'
import { Tokens } from '../interfaces/token.interface'
import { UserRepository as MockUserRepository } from '../__mocks__/user.repository'
import { ConfigService as MockConfigService } from '../../../shared/tests/__mocks__/config.service'
import { authStub } from './stubs/auth.stub'
import { jwtStub } from './stubs/jwt.stub'
import { userStub } from './stubs/user.stub'

describe('AuthService', () => {
	let authService: AuthService
	let userRepository: UserRepository
	let jwtService: JwtService
	let configService: ConfigService

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [JwtModule.register(jwtStub())],
			providers: [
				AuthService,
				{
					provide: UserRepository.name,
					useValue: MockUserRepository
				},
				{
					provide: ConfigService,
					useValue: MockConfigService
				}
			]
		}).compile()

		authService = moduleRef.get<AuthService>(AuthService)
		userRepository = moduleRef.get<UserRepository>(UserRepository.name)
		jwtService = moduleRef.get<JwtService>(JwtService)
		configService = moduleRef.get<ConfigService>(ConfigService)

		jest.clearAllMocks()
	})

	describe('signup', () => {
		describe('when signup is called', () => {
			let tokens: Tokens
			let createUserDto: CreateUserDto

			beforeEach(async () => {
				createUserDto = userStub()
				jest.spyOn(jwtService, 'signAsync').mockResolvedValue('as11df51wdfq')
			})

			test('then it should call userRepository signup', async () => {
				jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue(null)
				tokens = await authService.signup(createUserDto)
				expect(userRepository.findOneByUsername).toHaveBeenCalledWith(createUserDto.username)
			})

			test('then it should throw UnprocessableEntityException when user not found', async () => {
				try {
					jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue(userDocumentStub())
					tokens = await authService.signup(createUserDto)
				} catch (error) {
					expect(error).toBeInstanceOf(UnprocessableEntityException)
				}
			})

			test('then it should return tokens', () => {
				expect(tokens).toEqual(authStub())
			})
		})
	})

	describe('login', () => {
		describe('when login is called', () => {
			let tokens: Tokens
			let loginDto: LoginDto

			beforeEach(async () => {
				loginDto = {
					username: userStub().username,
					password: userStub().password
				}
				jest.spyOn(jwtService, 'signAsync').mockResolvedValue('as11df51wdfq')
			})

			test('then it should call authService validateUser', async () => {
				jest.spyOn(authService, 'validateUser').mockResolvedValue(userDocumentStub())
				tokens = await authService.login(loginDto)

				expect(authService.validateUser).toHaveBeenCalledWith(loginDto.username, loginDto.password)
			})

			test('then it should throw ForbiddenException when password incorrect or user not found', async () => {
				try {
					jest.spyOn(authService, 'validateUser').mockResolvedValue(null)
					tokens = await authService.login(loginDto)
				} catch (error) {
					expect(error).toBeInstanceOf(ForbiddenException)
				}
			})

			test('then it should return tokens', () => {
				expect(tokens).toEqual(authStub())
			})
		})
	})

	describe('validateUser', () => {
		describe('when validateUser is called', () => {
			let username: string, password: string, user: UserDocument

			beforeEach(async () => {
				username = userStub().username
				password = userStub().password
				jest.spyOn(userRepository, 'findOne').mockResolvedValue(userDocumentStub())
				jest.spyOn(argon, 'verifyPassword').mockResolvedValue(true)
			})

			test('then it should call userRepository findOne', async () => {
				user = (await authService.validateUser(username, password)) as UserDocument

				expect(userRepository.findOne).toHaveBeenCalledWith({ username }, { password: true })
			})

			test('then it should throw ForbiddenException when password incorrect or user not found', async () => {
				try {
					jest.spyOn(argon, 'verifyPassword').mockResolvedValue(false)
					user = (await authService.validateUser(username, password)) as UserDocument
				} catch (error) {
					expect(error).toBeInstanceOf(ForbiddenException)
				}
			})

			test('then it should return user', async () => {
				user = (await authService.validateUser(username, password)) as UserDocument
				const { password: pass, ...userStub } = userDocumentStub()

				expect(user).toEqual(userStub)
			})
		})
	})

	describe('sendAuthorizedMessage', () => {
		describe('when sendAuthorizedMessage is called', () => {
			let jwtConfig: JwtConfig, tokens: Tokens, userId: string
			let payload: JwtPayload

			beforeEach(async () => {
				userId = userDocumentStub()._id
				payload = { id: userId }
				jwtConfig = configService.get<JwtConfig>('jwt')
				jest.spyOn(jwtService, 'signAsync').mockResolvedValue('as11df51wdfq')
			})

			test('then it should return tokens', async () => {
				tokens = await authService.sendAuthorizedMessage(userDocumentStub()._id)
				expect(configService.get).toBeCalledWith('jwt')

				jwtService.signAsync(payload, jwtConfig.access).then((token) => {
					expect(token).toEqual('as11df51wdfq')
				})

				jwtService.signAsync(payload, jwtConfig.refresh).then((token) => {
					expect(token).toEqual('as11df51wdfq')
				})

				expect(tokens).toEqual(authStub())
			})
		})
	})
})
