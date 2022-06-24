import { ConfigService } from '@nestjs/config'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { ServerOptions } from 'socket.io'

const REDIS_DEFAULT_CONNECTION = 'redis://127.0.0.1:6379/0'

export class RedisIoAdapter extends IoAdapter {
	private redisConnectionUrl: string

	constructor(app: NestFastifyApplication) {
		super(app)
		this.redisConnectionUrl =
			app.get(ConfigService).get<string>('databases.redis.uri') || REDIS_DEFAULT_CONNECTION
	}

	private adapterConstructor: ReturnType<typeof createAdapter>

	async connectToRedis(): Promise<void> {
		const pubClient = createClient({ url: this.redisConnectionUrl })
		const subClient = pubClient.duplicate()

		await Promise.all([pubClient.connect(), subClient.connect()])

		this.adapterConstructor = createAdapter(pubClient, subClient)
	}

	createIOServer(port: number, options?: ServerOptions): any {
		const server = super.createIOServer(port, options)
		server.adapter(this.adapterConstructor)
		return server
	}
}
