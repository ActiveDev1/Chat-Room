import { authStub } from '../tests/stubs/auth.stub'

export const AuthService = jest.fn().mockReturnValue({
	signup: jest.fn().mockResolvedValue(authStub()),
	login: jest.fn().mockResolvedValue(authStub())
})
