import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { MessageContent, MessageContentSchema } from './message-content.schema'

@Schema({ versionKey: false })
export class Message extends Document {
	@Prop({ type: Types.ObjectId, ref: 'Chat' })
	chatId: Types.ObjectId

	@Prop({ type: MessageContentSchema, required: true })
	content: MessageContent

	@Prop({ type: Types.ObjectId, ref: 'User' })
	sender: Types.ObjectId
}

export const MessageSchema = SchemaFactory.createForClass(Message)
