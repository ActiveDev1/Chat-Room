import { CreateUserDto } from '../../dtos/create-user.dto'

export const userStub = (): CreateUserDto => {
	return {
		name: 'Mahdi',
		username: 'Mahdi007',
		password: 'asdqwfwfvwe'
	}
}
