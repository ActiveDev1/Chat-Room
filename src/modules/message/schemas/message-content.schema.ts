import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ _id: false })
export class MessageContent extends Document {
	@Prop({ required: true })
	text: string

	@Prop()
	image: string
}

export const MessageContentSchema = SchemaFactory.createForClass(MessageContent)
