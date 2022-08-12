import { userStub } from '../tests/stubs/user.stub'

export const UserService = jest.fn().mockReturnValue({
	findAll: jest.fn().mockResolvedValue([userStub()]),
	findOne: jest.fn().mockResolvedValue(userStub()),
	update: jest.fn().mockResolvedValue(userStub()),
	setOnline: jest.fn().mockResolvedValue(userStub()),
	setOffline: jest.fn().mockResolvedValue(userStub())
})
