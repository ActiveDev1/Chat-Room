import { userStub } from '../../../modules/user/tests/stubs/user.stub'
import { jwtPayloadStub } from '../stubs/jwt-payload.stub'

export const JwtStrategy = {
	verifyToken: jest.fn().mockResolvedValue(jwtPayloadStub()),
	validate: jest.fn().mockResolvedValue(userStub())
}
