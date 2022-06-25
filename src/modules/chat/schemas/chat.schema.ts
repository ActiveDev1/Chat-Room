import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Message } from '../../../modules/message/schemas/message.schema'
import { Room, RoomSchema } from './room.schema'

@Schema({ versionKey: false })
export class Chat extends Document {
	@Prop({ type: [MongooseSchema.Types.ObjectId], required: true, ref: 'User' })
	users: string[]

	@Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Message' })
	latestMessage: Message

	@Prop({ type: RoomSchema, default: null })
	room: Room
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
