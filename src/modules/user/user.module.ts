import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtStrategy } from '../../shared/strategies/jwt.strategy'
import { ChatModule } from '../chat/chat.module'
import { User, UserSchema } from './schemas/user.schema'
import { UserGateway } from './user.gateway'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), ChatModule],
	providers: [
		UserGateway,
		UserService,
		JwtService,
		JwtStrategy,
		{
			provide: 'UserRepository',
			useClass: UserRepository
		}
	]
})
export class UserModule {}
