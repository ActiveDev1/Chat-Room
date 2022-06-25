import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ versionKey: false, _id: false })
export class Room extends Document {
	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	publicId: string

	@Prop({ required: true, default: false })
	isPrivate: boolean
}

export const RoomSchema = SchemaFactory.createForClass(Room)
