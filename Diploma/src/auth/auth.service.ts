import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UserService } from 'src/user/user.service'
import { RegisterClientDto, LoginDto } from './dto/auth.dto'
import { ILoginResponse, IRegisterClientResponse } from './interface/auth.interface'

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  /** Вход */
  async login(dto: LoginDto): Promise<ILoginResponse> {
    const user = await this.userService.findByEmail(dto.email)

    if (!user || !await this.verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Неверный логин или пароль')
    }

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
      role: user.role,
    })

    return {
      token,
      user: {
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone
      },
    }
  }

  /** Регистрация клиента */
  async register(dto: RegisterClientDto): Promise<IRegisterClientResponse> {
    const user = await this.userService.create(dto)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }

  /** Проверка пароля */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}
