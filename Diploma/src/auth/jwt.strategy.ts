import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthService } from './auth.service'
import config from 'src/config'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.jwtSecret
    })
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.email)
    if (!user) {
      throw new UnauthorizedException('Ошибка аутентификации')
    }
    return user
  }
}