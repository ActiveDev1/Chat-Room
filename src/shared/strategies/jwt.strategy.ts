import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JwtConfig } from '../../config/configuration'
import { UserRepositoryInterface } from '../../modules/user/interfaces/user.repository.interface'
import { UserDocument } from '../../modules/user/schemas/user.schema'
import { UserRepository } from '../../modules/user/user.repository'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

@Injectable()
export class JwtStrategy {
	constructor(
		@Inject(UserRepository.name)
		private readonly userRepository: UserRepositoryInterface,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService
	) {}

	async verifyToken(token: string) {
		try {
			return await this.jwtService.verifyAsync<JwtPayload>(
				token,
				this.config.get<JwtConfig>('jwt').access
			)
		} catch (error) {
			return null
		}
	}

	async validate(token: string): Promise<UserDocument> {
		const jwtPayload = await this.verifyToken(token)
		return jwtPayload && (await this.userRepository.findById(jwtPayload.id))
	}
}
