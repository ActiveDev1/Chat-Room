import * as SocketIo from 'socket.io'

export interface Socket extends SocketIo.Socket {
	userId: string
}
