import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtStrategy } from '../../shared/strategies/jwt.strategy'
import { User, UserSchema } from './schemas/user.schema'
import { UserGateway } from './user.gateway'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
	providers: [UserGateway, UserService, JwtService, JwtStrategy, UserRepository]
})
export class UserModule {}
