import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import configuration from './config/configuration'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { MessageModule } from './modules/message/message.module'
import { ChatModule } from './modules/chat/chat.module'

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
				uri: config.get<string>('databases.mongodb.uri'),
				connectionFactory: (connection: Connection) => {
					connection.plugin(require('mongoose-unix-timestamp'))
					return connection
				}
			}),
			inject: [ConfigService]
		}),
		AuthModule,
		UserModule,
		MessageModule,
		ChatModule
	]
})
export class AppModule {}
