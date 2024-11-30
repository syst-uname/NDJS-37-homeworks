import { Controller, Post, Body } from '@nestjs/common'

import { AuthService } from './auth.service'
import { ClientRegisterDto, SigninDto } from './dto/auth.dto'
import { IClientRegisterResponse } from './interface/auth.interface'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Вход
  @Post('auth/login')
  login(@Body() dto: SigninDto) {
    return this.authService.login(dto)
  }

  // Выход
  @Post('auth/logout')
  logout() {
    return this.authService.logout()
  }

  // Регистрация
  @Post('client/register')
  register(@Body() dto: ClientRegisterDto): Promise<IClientRegisterResponse> {
    return this.authService.register(dto)
  }
}
