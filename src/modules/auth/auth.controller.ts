import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { LoginDto } from './dtos/login.dto'
import { Tokens } from './interfaces/token.interface'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	async signup(@Body() body: CreateUserDto): Promise<Tokens> {
		return await this.authService.signup(body)
	}

	@Post('login')
	async signin(@Body() body: LoginDto): Promise<Tokens> {
		return await this.authService.login(body)
	}
}
