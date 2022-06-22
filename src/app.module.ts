import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import configuration from './config/configuration'
import { UserModule } from './modules/user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			expandVariables: true,
			load: [configuration],
			envFilePath: `.env.development`
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				uri: config.get<string>('databases.mongodb.uri')
			}),
			inject: [ConfigService]
		}),
		UserModule
	]
})
export class AppModule {}
