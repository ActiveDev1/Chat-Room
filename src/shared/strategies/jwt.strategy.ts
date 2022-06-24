import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JwtConfig } from 'src/config/configuration'
import { UserDocument } from 'src/modules/user/schemas/user.schema'
import { UserRepository } from 'src/modules/user/user.repository'

@Injectable()
export class JwtStrategy {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
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