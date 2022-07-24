import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../user/schemas/user.schema'
import { UserRepository } from '../user/user.repository'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				secret: config.get('jwt.access.secret'),
				signOptions: { expiresIn: config.get('jwt.access.expiresIn') }
			}),
			inject: [ConfigService]
		}),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		{
			provide: UserRepository.name,
			useClass: UserRepository
		}
	]
})
export class AuthModule {}
