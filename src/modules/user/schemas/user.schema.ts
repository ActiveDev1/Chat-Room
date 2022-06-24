import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({ versionKey: false })
export class User {
	@Prop({ required: true })
	name: string

	@Prop({ unique: true, required: true })
	username: string

	@Prop({ required: true, select: false })
	password: string

	@Prop({
		required: true,
		default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
	})
	avatar: string

	@Prop({ required: true, default: true })
	isOnline: boolean

	@Prop({ required: true })
	lastSeen: number
}

export const UserSchema = SchemaFactory.createForClass(User)
