import { ArgumentsHost, Catch, HttpException } from '@nestjs/common'
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
	catch(exception: WsException | HttpException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient<Socket>()
		const isWsExeption = exception instanceof WsException
		if (!isWsExeption) {
			const error = exception.getResponse()
			const details = error instanceof Object ? { ...error } : { message: error }
			client.emit('error', details)
		} else {
			super.catch(exception, host)
		}
	}
}
