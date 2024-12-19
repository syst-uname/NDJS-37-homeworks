import { Controller, Post, Body, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common'

import { UserService } from './user.service'
import { CreateUserDto } from './dto'
import { ICreateUserResponse, IFindUsersParams } from './types'
import { UserResponseInterceptor } from './interceptors'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { Roles } from '@src/auth/decorators'
import { ROLE } from '@src/auth/constants'

@Controller()
@UseGuards(JwtAuthRoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Создание пользователя  
  @Post('admin/users')
  @Roles(ROLE.ADMIN)
  async create(@Body() dto: CreateUserDto): Promise<ICreateUserResponse> {
    const user = await this.userService.create(dto)
    const { id, email, name, contactPhone, role } = user
    return { id, email, name, contactPhone, role }
  }

  // Получение списка пользователей (admin)
  @Get('admin/users')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(UserResponseInterceptor)
  async findAllForAdmin(@Query() params: IFindUsersParams) {
    return await this.userService.findAll(params)
  }

  // Получение списка пользователей (manager)  
  @Get('manager/users')
  @Roles(ROLE.MANAGER)
  @UseInterceptors(UserResponseInterceptor)
  async findAllForManager(@Query() params: IFindUsersParams) {
    return await this.userService.findAll(params)
  }
}
