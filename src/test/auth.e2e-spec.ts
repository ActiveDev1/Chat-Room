import { ConfigModule, ConfigService } from '@nestjs/config'
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mongoose'
import { CreateUserDto } from 'src/modules/auth/dtos/create-user.dto'
import { LoginDto } from 'src/modules/auth/dtos/login.dto'
import * as supertest from 'supertest'
import configuration from '../config/configuration'
import { AuthModule } from '../modules/auth/auth.module'
import { Tokens } from '../modules/auth/interfaces/token.interface'
import { UserRepository } from '../modules/user/user.repository'

describe('AuthController (e2e)', () => {
	let app: NestFastifyApplication
	let userRepository: UserRepository

	const apiClient = () => {
		return supertest(app.getHttpServer())
	}

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					cache: true,
					expandVariables: true,
					load: [configuration],
					envFilePath: '.env.test'
				}),
				MongooseModule.forRootAsync({
					imports: [ConfigModule],
					useFactory: async (config: ConfigService) => ({
						uri: config.get<string>('databases.mongodb.uri')
					}),
					inject: [ConfigService]
				}),
				AuthModule
			]
		}).compile()

		app = moduleFixture.createNestApplication<NestFastifyApplication>()
		await app.init()

		userRepository = moduleFixture.get<UserRepository>('UserRepository')
	})

	afterAll(async () => {
		await (app.get(getConnectionToken()) as Connection).db.dropDatabase()
		await app.close()
	})

	it('/signup (POST)', async () => {
		const body: CreateUserDto = { name: 'Mahdi', username: 'Mahdi007', password: 'strongPass' }

		const tokens: Tokens = (
			await apiClient().post('/auth/signup').expect('Content-Type', /json/).send(body).expect(201)
		).body

		expect(tokens).toEqual({
			accessToken: expect.any(String),
			refreshToken: expect.any(String)
		})
	})

	it('/login (POST)', async () => {
		const body: LoginDto = { username: 'Mahdi007', password: 'strongPass' }

		const tokens: Tokens = (
			await apiClient().post('/auth/login').expect('Content-Type', /json/).send(body).expect(200)
		).body

		expect(tokens).toEqual({
			accessToken: expect.any(String),
			refreshToken: expect.any(String)
		})
	})
})
