import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ChatRepository } from '../chat/chat.repository'
import { Chat, ChatSchema } from '../chat/schemas/chat.schema'
import { MessageGateway } from './message.gateway'
import { MessageRepository } from './message.repository'
import { MessageService } from './message.service'
import { Message, MessageSchema } from './schemas/message.schema'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
		MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])
	],
	providers: [
		MessageGateway,
		MessageService,
		{
			provide: 'MessageRepository',
			useClass: MessageRepository
		},
		{
			provide: 'ChatRepository',
			useClass: ChatRepository
		}
	]
})
export class MessageModule {}
