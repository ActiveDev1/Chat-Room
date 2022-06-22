import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'
import { UserGateway } from './user.gateway'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
	providers: [UserGateway, UserService, UserRepository]
})
export class UserModule {}
