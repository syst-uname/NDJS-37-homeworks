import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common'

import { UserService } from './user.service'
import { CreateUserDto, FindUsersQueryDto } from './dto/user.dto'
import { ICreateUserResponse, IFindUserResponse } from './interface/user.interface'
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { ROLE } from './constants/user.constants'

@Controller()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Создание пользователя  
  @Post('admin/users')
  @Roles(ROLE.ADMIN)
  async create(@Body() dto: CreateUserDto): Promise<ICreateUserResponse> {
    const user = await this.userService.create(dto)
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role
    }
  }

  // Получение списка пользователей (admin)
  @Get('admin/users')
  @Roles(ROLE.ADMIN)
  findAllForAdmin(@Query() query: FindUsersQueryDto): Promise<IFindUserResponse[]> {
    return this.userService.findAll(query)
  }

  // Получение списка пользователей (manager)  
  @Get('manager/users')
  @Roles(ROLE.MANAGER)
  findAllForManager(@Query() query: FindUsersQueryDto): Promise<IFindUserResponse[]> {
    return this.userService.findAll(query)
  }
}
