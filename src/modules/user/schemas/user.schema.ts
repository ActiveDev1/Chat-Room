import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { getNow } from 'src/shared/utils/functions'

@Schema({ versionKey: false })
export class User extends Document {
	@Prop({ required: true })
	name: string

	@Prop({ unique: true, required: true })
	username: string

	@Prop({ required: true, select: false })
	password: string

	@Prop({ required: true, index: true })
	socketId: string

	@Prop({
		required: true,
		default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
	})
	avatar: string

	@Prop({ required: true, default: true })
	isOnline: boolean

	@Prop({ required: true, default: () => getNow() })
	lastSeen: number
}

export const UserSchema = SchemaFactory.createForClass(User)
