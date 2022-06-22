import { hash, verify, argon2id } from 'argon2'

const hashPassword = async (string: string) => {
	return await hash(string, {
		type: argon2id
	})
}

const verifyPassword = async (hash: string, string: string) => {
	return await verify(hash, string)
}

export { hashPassword, verifyPassword }
