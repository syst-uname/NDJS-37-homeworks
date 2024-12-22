import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import config from '@src/config'
import { UserService } from '@src/user/user.service'
import { COOKIE_TOKEN } from './constants'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.token,              // http
        (req) => req?.handshake?.headers?.cookie   // ws
          .split('; ')
          .find((cookie: string) => cookie.startsWith(COOKIE_TOKEN))
          .split('=')[1]
      ]),
      secretOrKey: config.auth.jwtSecret
    })
  }

  async validate(payload: any) {
    return await this.userService.findByEmail(payload.email)
  }
}