import { JwtModuleOptions } from '@nestjs/jwt'

export const jwtStub = (): JwtModuleOptions => {
	return {
		secret: 'strongSecret',
		signOptions: { expiresIn: 60 * 60 }
	}
}
