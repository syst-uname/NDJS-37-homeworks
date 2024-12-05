import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common'
import { Response } from 'express'

import { AuthService } from './auth.service'
import { RegisterClientDto, LoginDto } from './dto/auth.dto'
import { IRegisterClientResponse } from './interface/auth.interface'
import { JwtUnauthGuard } from './guards/jwt.unauth.guard'
import { JwtAuthGuard } from './guards/jwt.auth.guard'
import { COOKIE_TOKEN } from './constants/constants'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Вход
  @Post('auth/login')
  @UseGuards(JwtUnauthGuard)
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response
  ) {
    const { user, token } = await this.authService.login(dto)
    res.cookie(COOKIE_TOKEN, token, { httpOnly: true })       // Установка JWT в куки
    return res.status(HttpStatus.OK).json(user)
  }

  // Выход
  @Post('auth/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    res.clearCookie(COOKIE_TOKEN)
    return res.sendStatus(HttpStatus.OK)
  }

  // Регистрация
  @Post('client/register')
  @UseGuards(JwtUnauthGuard)
  async register(@Body() dto: RegisterClientDto): Promise<IRegisterClientResponse> {
    return this.authService.register(dto)
  }
}
