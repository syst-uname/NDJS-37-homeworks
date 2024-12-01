import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from 'src/user/user.service'
import { UserDocument } from 'src/user/schemas/user.schema'
import { RegisterClientDto, SigninDto } from './dto/auth.dto'
import { IRegisterClientResponse } from './interface/auth.interface'

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  /** Вход */
  async login(dto: SigninDto) {
    if (!await this.userService.verifyPassword(dto.email, dto.password)) {
      throw new UnauthorizedException('Неверный логин или пароль')
    }
    const user = await this.userService.findByEmail(dto.email)
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    }
    const token = this.createToken(payload)
    return { token }
  }

  /** Валидация пользователя */
  async validateUser(email: string): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email)
    if (!user) {
      return null
    }
    return user
  }

  /** Создание токена */
  createToken(payload: any) {   // TODO объединить 
    return this.jwtService.sign(payload)
  }

  /** Выход */
  logout() {
    return { message: 'Вы вышли из системы' }
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
