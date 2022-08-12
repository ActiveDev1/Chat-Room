import { Document, Types } from 'mongoose'
import { Chat } from '../../schemas/chat.schema'

export const chatStub = (): Chat & Document => {
	return {
		_id: '507f1f77bcf86cd799439011',
		users: ['507f1f77bcf86cd795454541', '507f1f77bcf86cd715862511'],
		latestMessage: {
			chatId: new Types.ObjectId(),
			content: {
				image: '/users/avatars/ssdfsad561256sdfa6sd',
				text: 'Hi everyone'
			},
			sender: new Types.ObjectId()
		},
		room: {
			name: 'Bax',
			publicId: 'Bax',
			isPrivate: false
		}
	} as Chat & Document
}
