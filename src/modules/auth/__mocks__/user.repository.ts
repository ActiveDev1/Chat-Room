import { userStub } from '../../../modules/user/tests/stubs/user.stub'

export const UserRepository = {
	findOneByUsername: jest.fn().mockResolvedValue(userStub()),
	create: jest.fn().mockResolvedValue(userStub()),
	findOne: jest.fn().mockResolvedValue(userStub())
}
