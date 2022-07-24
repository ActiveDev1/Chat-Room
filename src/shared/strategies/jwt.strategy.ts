import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserRepositoryInterface } from '../../modules/user/interfaces/user.repository.interface'
import { JwtConfig } from '../../config/configuration'
import { UserDocument } from '../../modules/user/schemas/user.schema'
import { UserRepository } from '../../modules/user/user.repository'

@Injectable()
export class JwtStrategy {
	constructor(
		@Inject(UserRepository.name)
		private readonly userRepository: UserRepositoryInterface,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService
	) {}

	async verifyToken(token: string) {
		return await this.jwtService.verifyAsync(token, this.config.get<JwtConfig>('jwt').access)
	}

	async validate(token: string): Promise<UserDocument> {
		const jwtPayload = await this.verifyToken(token)
		const user = jwtPayload && (await this.userRepository.findById(jwtPayload.id))
		if (!user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
