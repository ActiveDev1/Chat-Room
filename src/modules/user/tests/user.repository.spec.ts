import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { FilterQuery } from 'mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { UserRepository } from '../user.repository'
import { userStub } from './stubs/user.stub'
import { UserModel } from './support/user.model'

describe('UserRepository', () => {
	let userRepository: UserRepository
	let userModel: UserModel
	let userFilterQuery: FilterQuery<User>

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				UserRepository,
				{
					provide: getModelToken(User.name),
					useClass: UserModel
				}
			]
		}).compile()

		userRepository = moduleRef.get<UserRepository>(UserRepository)
		userModel = moduleRef.get<UserModel>(getModelToken(User.name))
		userFilterQuery = {
			username: userStub().username
		}

		jest.clearAllMocks()
	})

	describe('findOne', () => {
		describe('when findOne is called', () => {
			let user: UserDocument

			beforeEach(async () => {
				jest.spyOn(userModel, 'findOne')
				user = await userRepository.findOne(userFilterQuery)
			})

			test('then it should call the userModel findOne', () => {
				expect(userModel.findOne).toHaveBeenCalledWith(userFilterQuery, undefined, undefined)
			})

			test('then it should return a user', () => {
				expect(user).toEqual(userStub())
			})
		})
	})

	describe('find', () => {
		describe('when find is called', () => {
			let users: User[]

			beforeEach(async () => {
				jest.spyOn(userModel, 'find')
				users = await userRepository.find()
			})

			test('then it should call the userModel find', () => {
				expect(userModel.find).toHaveBeenCalled()
			})

			test('then it should return all users', () => {
				expect(users).toEqual([userStub()])
			})
		})
	})

	describe('findByIds', () => {
		describe('when findByIds is called', () => {
			const usersIds: string[] = [userStub()._id]
			let users: UserDocument[]

			beforeEach(async () => {
				jest.spyOn(userRepository, 'findByIds')
				users = await userRepository.findByIds(usersIds)
			})

			test('then it should call findByIds', () => {
				expect(userRepository.findByIds).toHaveBeenCalledWith(usersIds)
			})

			test('then it should return users', () => {
				expect(users).toEqual([userStub()])
			})
		})
	})

	describe('findOneByUsername', () => {
		describe('when findOneByUsername is called', () => {
			let user: UserDocument

			beforeEach(async () => {
				jest.spyOn(userRepository, 'findOneByUsername')
				user = await userRepository.findOneByUsername(userFilterQuery.username)
			})

			test('then it should call findOneByUsername', () => {
				expect(userRepository.findOneByUsername).toHaveBeenCalledWith(userFilterQuery.username)
			})

			test('then it should return users', () => {
				expect(user).toEqual(userStub())
			})
		})
	})

	describe('updateOne', () => {
		describe('when updateOne is called', () => {
			let user: User

			beforeEach(async () => {
				jest.spyOn(userRepository, 'updateOne').mockResolvedValue(userStub())
				user = await userRepository.updateOne(userStub()._id, userStub())
			})

			test('then it should call updateOne', () => {
				expect(userRepository.updateOne).toHaveBeenCalledWith(userStub()._id, userStub())
			})

			test('then it should return user', () => {
				expect(user).toEqual(userStub())
			})
		})
	})
})
