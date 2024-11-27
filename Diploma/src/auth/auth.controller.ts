import { Controller, Post, Body } from '@nestjs/common'
import { SigninDto } from './dto/auth.dto'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // вход
  @Post('auth/login')
  login(@Body() data: SigninDto) {
    return this.authService.login(data)
  }

  // выход
  @Post('auth/logout')
  logout() {
    return this.authService.logout()
  }

  // регистрация
  @Post('client/register')
  register() {
    // return this.authService.registerClient()
  }
}
