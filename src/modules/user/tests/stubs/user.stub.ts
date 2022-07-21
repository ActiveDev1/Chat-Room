import { Document } from 'mongoose'
import { User } from '../../schemas/user.schema'

export const userStub = (): User & Document => {
	return {
		_id: '507f1f77bcf86cd799439011',
		name: 'Mahdi',
		username: 'Mahdi007',
		password: 'asdqwfwfvwe',
		socketId: 'asfwvwefw51455f0c5we5',
		avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
		isOnline: true,
		lastSeen: 1664785216
	} as User & Document
}
