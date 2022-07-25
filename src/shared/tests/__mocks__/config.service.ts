import { JwtConfig } from 'src/config/configuration'

export const fakeJwtConfig: JwtConfig = {
	access: { secret: 'strongSecret', expiresIn: 3600 },
	refresh: { secret: 'asdasd', expiresIn: 3600 }
}

function getFakeConfig(key: string) {
	const configs = {
		jwt: fakeJwtConfig
	}
	return configs[key] || null
}

export const ConfigService = {
	get: jest.fn((key: string) => {
		return getFakeConfig(key)
	})
}
