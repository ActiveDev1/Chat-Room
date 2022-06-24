import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Chat } from '../../../modules/chat/schemas/chat.schema'
import { User } from '../../../modules/user/schemas/user.schema'
import { MessageContent, MessageContentSchema } from './message-content.schema'

@Schema({ versionKey: false })
export class Message extends Document {
	@Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Chat' })
	chat: Chat

	@Prop({ type: MessageContentSchema, required: true })
	content: MessageContent

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
	sender: User
}

export const MessageSchema = SchemaFactory.createForClass(Message)
