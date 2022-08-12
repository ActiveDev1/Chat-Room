import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { MessageContent, MessageContentSchema } from './message-content.schema'

type MessageDocument = Message & Document

@Schema({ versionKey: false })
class Message {
	@Prop({ type: Types.ObjectId, ref: 'Chat' })
	chatId: Types.ObjectId

	@Prop({ type: MessageContentSchema, required: true })
	content: MessageContent

	@Prop({ type: Types.ObjectId, ref: 'User' })
	sender: Types.ObjectId
}

const MessageSchema = SchemaFactory.createForClass(Message)
MessageSchema.plugin(require('mongoose-unix-timestamp'))

export { Message, MessageDocument, MessageSchema }
