import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../user/schemas/user.schema'
import { UserRepository } from '../user/user.repository'
import { ChatGateway } from './chat.gateway'
import { ChatRepository } from './chat.repository'
import { ChatService } from './chat.service'
import { Chat, ChatSchema } from './schemas/chat.schema'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
	],
	providers: [
		ChatGateway,
		ChatService,
		{
			provide: 'ChatRepository',
			useClass: ChatRepository
		},
		{
			provide: 'UserRepository',
			useClass: UserRepository
		}
	],
	exports: [ChatService]
})
export class ChatModule {}
