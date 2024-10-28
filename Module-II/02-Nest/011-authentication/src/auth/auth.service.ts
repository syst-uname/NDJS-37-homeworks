import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { SigninDto, SignupDto } from './dto/auth.dto'
import { UserService } from 'src/user/user.service'
import { UserDocument } from 'src/user/schemas/user.schema'

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signup(data: SignupDto): Promise<UserDocument> {
    const user = await this.userService.create(data)
    return user
  }

  async signin(data: SigninDto) {
    if (!await this.userService.verifyPassword(data.email, data.password)) {
      throw new UnauthorizedException('Неверный логин или пароль')
    }
    const user = await this.userService.findByEmail(data.email)
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
    }
    const token = this.createToken(payload)
    return { token }
  }

  async validateUser(email: string): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email)
    if (!user) {
      return null
    }
    return user
  }

  createToken(payload: any) {
    return this.jwtService.sign(payload)
  }
}
