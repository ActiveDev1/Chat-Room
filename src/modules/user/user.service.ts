import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { getNow } from '../../shared/utils/functions'
import { hashPassword } from '../../shared/utils/argon2'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRepository } from './user.repository'
import { ConnectionIdentify } from './interfaces/connection-identify.interface'

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async findAll() {
		return await this.userRepository.findAll()
	}

	async findOne(id: string) {
		const user = await this.userRepository.findById(id)
		if (!user) {
			throw new NotFoundException('User not found')
		}
		return user
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.userRepository.findById(id)

		if (user) {
			throw new UnprocessableEntityException('Duplicate user')
		}

		const hashedPassword = await hashPassword(updateUserDto.password)

		return await this.userRepository.updateOne(user.id, {
			...updateUserDto,
			password: hashedPassword
		})
	}

	async setOnline({ userId, socketId }: ConnectionIdentify) {
		return await this.userRepository.updateOne(
			{ userId },
			{ isOnline: true, socketId, lastSeen: getNow() }
		)
	}

	async setOffline({ userId, socketId }: Partial<ConnectionIdentify>) {
		return await this.userRepository.updateOne(
			{ userId, socketId },
			{ isOnline: false, lastSeen: getNow() }
		)
	}
}
