import { Controller, Get, Post, Body, Param } from '@nestjs/common'

import { UserService } from './user.service'
import { UserDocument } from './schemas/user.schema'
import { CreateUserDto } from './dto/user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userService.create(createUserDto)
  }

  @Get()
  findAll(): Promise<UserDocument[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }
}
