import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { hashPassword } from '../../shared/utils/argon2'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async create(createUserDto: CreateUserDto) {
		const { name, username, password } = createUserDto
		const user = await this.userRepository.findOneByUsername(username)

		if (user) {
			throw new UnprocessableEntityException('Duplicate user')
		}

		const hashedPassword = await hashPassword(password)

		return await this.userRepository.create({ name, username, password: hashedPassword })
	}

	findAll() {
		return `This action returns all user`
	}

	findOne(id: number) {
		return `This action returns a #${id} user`
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`
	}

	remove(id: number) {
		return `This action removes a #${id} user`
	}
}
