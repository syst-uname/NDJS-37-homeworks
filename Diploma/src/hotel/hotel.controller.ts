import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'

import { HotelService } from './hotel.service'
import { CreateHotelDto, UpdateHotelDto } from './dto'
import { ICreateHotelResponse, IUpdateHotelResponse } from './types'
import { JwtAuthGuard } from 'src/auth/guards'
import { Roles } from 'src/auth/decorators'
import { ROLE } from 'src/user/constants'

@Controller()
@UseGuards(JwtAuthGuard)
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  // Добавление гостиницы   
  @Post('admin/hotels')
  @Roles(ROLE.ADMIN)
  async create(@Body() dto: CreateHotelDto): Promise<ICreateHotelResponse> {
    const hotel = await this.hotelService.create(dto)
    return {
      id: hotel._id.toString(),
      title: hotel.title,
      description: hotel.description
    }
  }

  // Изменение гостиницы   
  @Post('admin/hotels/:id')
  @Roles(ROLE.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateHotelDto
  ): Promise<IUpdateHotelResponse> {
    const hotel = await this.hotelService.update(id, dto)
    return {
      id: hotel._id.toString(),
      title: hotel.title,
      description: hotel.description
    }
  }

}
