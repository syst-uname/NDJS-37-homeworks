import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common'

import { UserService } from './user.service'
import { CreateUserDto, FindUsersQueryDto } from './dto/user.dto'
import { ICreateUserResponse, IFindUserResponse } from './interface/user.interface'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard'
import { ROLE } from './constants/user.constants'

@UseGuards(JwtAuthGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Создание пользователя  
  @Post('admin/users')
  @Roles(ROLE.CLIENT)     // TODO: test
  create(@Body() dto: CreateUserDto): Promise<ICreateUserResponse> {
    return this.userService.create(dto)
  }

  // Получение списка пользователей  
  @Get('admin/users')
  @Roles(ROLE.ADMIN)
  findAll(@Query() query: FindUsersQueryDto): Promise<IFindUserResponse[]> {
    return this.userService.findAll(query)
  }
}
