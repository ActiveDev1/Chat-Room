export interface RestApiConfig {
	host: string
	port: number
	logger: boolean
	prettyLogger: boolean
}

export interface DatabaseConfig {
	host: string
	port: number
	db: string
	username: string
	password: string
	uri: string
}

export default () => ({
	server: {
		restApi: {
			host: process.env.REST_HOST,
			port: +process.env.REST_PORT,
			logger: !!process.env.REST_LOGGER,
			prettyLogger: !!process.env.REST_PRETTY_LOGGER
		} as RestApiConfig
	},
	databases: {
		mongodb: {
			host: process.env.MONGO_HOST,
			port: +process.env.MONGO_PORT,
			db: process.env.MONGO_DB,
			username: process.env.MONGO_USERNAME,
			password: process.env.MONGO_PASSWORD,
			uri: process.env.MONGO_URI
		} as DatabaseConfig,
		redis: {
			uri: process.env.REDIS_URI
		}
	}
})
