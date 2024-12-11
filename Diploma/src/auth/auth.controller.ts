import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common'
import { Response } from 'express'

import { AuthService } from './auth.service'
import { UserService } from '@src/user/user.service'
import { JwtAuthGuard, JwtUnauthGuard } from './guards'
import { LoginDto, RegisterClientDto } from './dto'
import { ILoginResponse, IRegisterClientResponse } from './types'
import { COOKIE_TOKEN, USER_ROLE } from './constants'

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  // Вход
  @Post('auth/login')
  @UseGuards(JwtUnauthGuard)
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response
  ) {
    const user = await this.authService.validateUser(dto.email, dto.password)
    const { token } = await this.authService.login(user)
    res.cookie(COOKIE_TOKEN, token, { httpOnly: true })       // Установка JWT в куки
    const response: ILoginResponse = {
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone
    }
    return res.status(HttpStatus.OK).json(response)
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
    const user = await this.userService.create({ ...dto, role: USER_ROLE.CLIENT })
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }
}
