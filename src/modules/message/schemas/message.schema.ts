import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { User } from '../../../modules/user/schemas/user.schema'
import { Chat } from '../../../modules/chat/schemas/chat.schema'

export type MessageDocument = Message & Document

@Schema({ versionKey: false })
export class Message {
	@Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Chat' })
	chat: Chat

	@Prop({ required: true })
	content: string

	@Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
	sender: User
}

export const MessageSchema = SchemaFactory.createForClass(Message)
