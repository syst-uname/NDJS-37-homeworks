import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common'

import { UserService } from './user.service'
import { CreateUserDto } from './dto'
import { ICreateUserResponse, IFindUserResponse, IFindUsersParams } from './types'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { Roles } from '@src/auth/decorators'
import { USER_ROLE } from '@src/auth/constants'

@Controller()
@UseGuards(JwtAuthRoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Создание пользователя  
  @Post('admin/users')
  @Roles(USER_ROLE.ADMIN)
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
  @Roles(USER_ROLE.ADMIN)
  findAllForAdmin(@Query() params: IFindUsersParams): Promise<IFindUserResponse[]> {
    return this.findAll(params)
  }

  // Получение списка пользователей (manager)  
  @Get('manager/users')
  @Roles(USER_ROLE.MANAGER)
  findAllForManager(@Query() params: IFindUsersParams): Promise<IFindUserResponse[]> {
    return this.findAll(params)
  }

  /** Получение списка пользователей */
  private async findAll(params: IFindUsersParams): Promise<IFindUserResponse[]> {
    const users = await this.userService.findAll(params)
    return users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    }))
  }
}
