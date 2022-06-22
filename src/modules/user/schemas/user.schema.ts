import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({
	timestamps: {
		currentTime() {
			return Math.floor(Date.now() / 1000)
		}
	},
	versionKey: false
})
export class User {
	@Prop({ required: true })
	name: string

	@Prop({ unique: true, required: true })
	username: string

	@Prop({ required: true })
	password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
