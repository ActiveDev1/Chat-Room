import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ versionKey: false, _id: false })
export class Room extends Document {
	@Prop({ required: true })
	title: string

	@Prop({ required: true })
	roomId: string
}

export const RoomSchema = SchemaFactory.createForClass(Room)
