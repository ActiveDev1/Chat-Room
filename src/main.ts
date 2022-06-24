import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { RedisIoAdapter } from './adapters/redis-io.adapter'
import { AppModule } from './app.module'
import { RestApiConfig } from './config/configuration'

async function bootstrap() {
	const [logger, prettyPrint] = [process.env.REST_LOGGER, process.env.REST_PRETTY_LOGGER]
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({
			logger: logger && prettyPrint ? { prettyPrint: { colorize: true } } : logger ? true : false
		})
	)
	app.useGlobalPipes(new ValidationPipe())

	const redisIoAdapter = new RedisIoAdapter(app)
	await redisIoAdapter.connectToRedis()
	app.useWebSocketAdapter(redisIoAdapter)

	const { host, port } = app.get(ConfigService).get<RestApiConfig>('server.restApi')

	await app.listen(port, host)
}

bootstrap()
