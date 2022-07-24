import {
	ForbiddenException,
	Inject,
	Injectable,
	UnprocessableEntityException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JwtConfig } from '../../config/configuration'
import { JwtPayload } from '../../shared/interfaces/jwt-payload.interface'
import * as argon from '../../shared/utils/argon2'
import { UserRepositoryInterface } from '../user/interfaces/user.repository.interface'
import { UserRepository } from '../user/user.repository'
import { CreateUserDto } from './dtos/create-user.dto'
import { LoginDto } from './dtos/login.dto'
import { Tokens } from './interfaces/token.interface'

@Injectable()
export class AuthService {
	constructor(
		@Inject(UserRepository.name)
		private readonly userRepository: UserRepositoryInterface,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async signup(createUserDto: CreateUserDto) {
		const { name, username, password } = createUserDto
		const user = await this.userRepository.findOneByUsername(username)

		if (user) {
			throw new UnprocessableEntityException('Duplicate user')
		}

		const hashedPassword = await argon.hashPassword(password)
		const newUser = await this.userRepository.create<CreateUserDto>({
			name,
			username,
			password: hashedPassword
		})

		return await this.sendAuthorizedMessage(newUser.id)
	}

	async login(loginDto: LoginDto) {
		const { username, password } = loginDto

		const user = await this.validateUser(username, password)
		if (!user) {
			throw new ForbiddenException('Username and or password is incorrect')
		}

		return await this.sendAuthorizedMessage(user.id)
	}

	async validateUser(username: string, password: string) {
		const user = await this.userRepository.findOne({ username }, { password: true })
		if (user && (await argon.verifyPassword(user.password, password))) {
			const { password, ...result } = user
			return result
		}
		return null
	}

	async sendAuthorizedMessage(userId: string): Promise<Tokens> {
		const payload: JwtPayload = { id: userId }
		const { access, refresh } = this.configService.get<JwtConfig>('jwt')

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, access),
			this.jwtService.signAsync(payload, refresh)
		])

		return { accessToken, refreshToken }
	}
}
