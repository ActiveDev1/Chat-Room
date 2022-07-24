import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { hashPassword } from '../../shared/utils/argon2'
import { getNow } from '../../shared/utils/functions'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRepositoryInterface } from './interfaces/user.repository.interface'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
	constructor(
		@Inject(UserRepository.name)
		private readonly userRepository: UserRepositoryInterface
	) {}

	async findAll() {
		return await this.userRepository.find()
	}

	async findOne(id: string) {
		const user = await this.userRepository.findById(id)
		if (!user) {
			throw new NotFoundException('User not found')
		}
		return user
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		let { username, password } = updateUserDto

		if (username) {
			const user = await this.userRepository.findOneByUsername(updateUserDto.username)

			if (user && user.username !== username) {
				throw new UnprocessableEntityException('Duplicate user')
			}
		}

		if (password) {
			password = await hashPassword(updateUserDto.password)
		}

		return await this.userRepository.updateOne(id, { ...updateUserDto, password })
	}

	async setOnline(id: string, socketId: string) {
		return await this.userRepository.updateOne(id, {
			isOnline: true,
			socketId,
			lastSeen: getNow()
		})
	}

	async setOffline(id: string) {
		return await this.userRepository.updateOne(id, { isOnline: false, lastSeen: getNow() })
	}
}
