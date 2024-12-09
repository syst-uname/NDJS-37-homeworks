import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import config from '@src/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '@src/user/user.module'
import { JwtStrategy } from '@src/auth/jwt.strategy'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: config.auth.jwtSecret,
      signOptions: { expiresIn: config.auth.jwtExpires },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
