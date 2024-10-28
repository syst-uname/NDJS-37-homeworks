import { Injectable } from '@nestjs/common'

import { SigninDto, SignupDto } from './dto/auth.dto'
import { UserService } from 'src/user/user.service'
import { UserDocument } from 'src/user/schemas/user.schema'

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
  ) {}

  async signup(data: SignupDto): Promise<UserDocument> {
    const user = await this.userService.create(data)
    return user
  }

  async signin(data: SigninDto) {
    if (!await this.userService.verifyPassword(data.email, data.password)) {
      throw new Error('Неверный логин или пароль')
    }
    return { message: 'Аутентификация прошла успешно' }
  }
}
