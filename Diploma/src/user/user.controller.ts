import { Controller, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { UserCreateDto } from './dto/user.dto'
import { IUserCreateResponse } from './interface/user.interface'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Создание пользователя  
  @Post('admin/users')
  create(@Body() dto: UserCreateDto): Promise<IUserCreateResponse> {
    return this.userService.create(dto)
  }
}
