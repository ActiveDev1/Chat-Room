import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
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

	const { host, port } = app.get<RestApiConfig>(ConfigService)

	await app.listen(port, host)
}

bootstrap()
