import { Controller, Post, Body } from '@nestjs/common'

import { SigninDto, SignupDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import { UserDocument } from 'src/user/schemas/user.schema'

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() data: SignupDto): Promise<UserDocument> {
    return this.authService.signup(data)
  }

  @Post('signin')
  signin(@Body() data: SigninDto) {
    return this.authService.signin(data)
  }
}
