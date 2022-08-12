import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

type RoomDocument = Room & Document

@Schema({ versionKey: false, _id: false })
class Room {
	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	publicId: string

	@Prop({ required: true, default: false })
	isPrivate: boolean
}

const RoomSchema = SchemaFactory.createForClass(Room)

export { Room, RoomDocument, RoomSchema }
