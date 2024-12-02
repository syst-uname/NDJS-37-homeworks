import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from 'src/user/user.service'
import { UserDocument } from 'src/user/schemas/user.schema'
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
    if (!await this.userService.verifyPassword(dto.email, dto.password)) {
      throw new UnauthorizedException('Неверный логин или пароль')
    }
    const user = await this.userService.findByEmail(dto.email)

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

  /** Валидация пользователя */
  async validateUser(email: string): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email)
    if (!user) {
      return null
    }
    return user
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
}
