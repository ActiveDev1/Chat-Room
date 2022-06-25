import { Room } from '../schemas/room.schema'

export interface CreateChat {
	users: string[]
	room?: Partial<Room>
}
