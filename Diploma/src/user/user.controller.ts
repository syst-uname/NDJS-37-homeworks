import { Controller, Post, Body, Get, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto, FindUsersQueryDto } from './dto/user.dto'
import { ICreateUserResponse, IFindUserResponse } from './interface/user.interface'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Создание пользователя  
  @Post('admin/users')
  create(@Body() dto: CreateUserDto): Promise<ICreateUserResponse> {
    return this.userService.create(dto)
  }

  // Получение списка пользователей  
  @Get('admin/users')
  findAll(@Query() query: FindUsersQueryDto): Promise<IFindUserResponse[]> {
    return this.userService.findAll(query)
  }
}
