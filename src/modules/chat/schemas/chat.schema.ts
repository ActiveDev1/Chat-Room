import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Message } from '../../../modules/message/schemas/message.schema'
import { Room, RoomSchema } from './room.schema'

type ChatDocument = Chat & Document

@Schema({ versionKey: false, id: true })
class Chat extends Document {
	@Prop({ type: [MongooseSchema.Types.ObjectId], required: true, ref: 'User' })
	users: string[]

	@Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Message' })
	latestMessage: Message

	@Prop({ type: RoomSchema, default: null })
	room: Room
}

const ChatSchema = SchemaFactory.createForClass(Chat)
ChatSchema.plugin(require('mongoose-unix-timestamp'), { tag: 'mongoose-unix-timestamp' })

export { Chat, ChatDocument, ChatSchema }
