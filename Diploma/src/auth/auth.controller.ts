import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common'
import { Response } from 'express'

import { AuthService } from './auth.service'
import { RegisterClientDto, LoginDto } from './dto/auth.dto'
import { ILoginResponse, IRegisterClientResponse } from './interface/auth.interface'
import { JwtAuthGuard } from './jwt.auth.guard'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Вход
  @Post('auth/login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response
  ) {     // TODO: подумать над возвращаемым типом
    const { user, token } = await this.authService.login(dto)
    res.cookie('token', token, { httpOnly: true })       // Установка JWT в куки
    return res.status(HttpStatus.OK).json(user)
  }

  // Выход
  @Post('auth/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    res.clearCookie('token')
    return res.sendStatus(HttpStatus.OK)
  }

  // Регистрация
  @Post('client/register')
  async register(@Body() dto: RegisterClientDto): Promise<IRegisterClientResponse> {
    return this.authService.register(dto)
  }
}
