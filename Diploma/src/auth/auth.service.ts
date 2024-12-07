import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UserService } from 'src/user/user.service'
import { UserDocument } from 'src/user/schemas/user.schema'

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  /** Валидация пользователя */
  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email)
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      throw new UnauthorizedException('Неверный логин или пароль')
    }
    return user
  }

  /** Вход */
  async login(user: UserDocument): Promise<{ token: string }> {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    }
    const token = this.jwtService.sign(payload)
    return { token }
  }
}
