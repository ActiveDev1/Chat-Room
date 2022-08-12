import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

type MessageContentDocument = MessageContent & Document

@Schema({ _id: false })
class MessageContent {
	@Prop({ required: true })
	text: string

	@Prop()
	image: string
}

const MessageContentSchema = SchemaFactory.createForClass(MessageContent)

export { MessageContent, MessageContentDocument, MessageContentSchema }
