import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Message } from '../../../modules/message/schemas/message.schema'
import { User } from '../../../modules/user/schemas/user.schema'

export type ChatDocument = Chat & Document

@Schema({ versionKey: false })
export class Chat {
	@Prop()
	title: string

	@Prop([{ type: [MongooseSchema.Types.ObjectId], ref: 'User' }])
	users: User[]

	@Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Message' })
	latestMessage: Message

	@Prop({ required: true })
	isGroup: boolean
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
