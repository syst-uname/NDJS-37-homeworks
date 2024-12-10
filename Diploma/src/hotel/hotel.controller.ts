import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'

import { HotelService } from './hotel.service'
import { CreateHotelDto, UpdateHotelDto } from './dto'
import { ICreateHotelResponse, ISearchHotelParams, ISearchHotelParamsResponse, IUpdateHotelResponse } from './types'
import { JwtAuthGuard } from '@src/auth/guards'
import { Roles } from '@src/auth/decorators'
import { USER_ROLE } from '@src/auth/constants'

@Controller()
@UseGuards(JwtAuthGuard)
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  // Добавление гостиницы   
  @Post('admin/hotels')
  @Roles(USER_ROLE.ADMIN)
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
  @Roles(USER_ROLE.ADMIN)
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

  // Получение списка гостиниц   
  @Get('admin/hotels')
  @Roles(USER_ROLE.ADMIN)
  async search(@Query() params: ISearchHotelParams): Promise<ISearchHotelParamsResponse[]> {
    const hotels = await this.hotelService.search(params)
    return hotels.map(hotel => ({
      id: hotel._id.toString(),
      title: hotel.title,
      description: hotel.description
    }))
  }
}
