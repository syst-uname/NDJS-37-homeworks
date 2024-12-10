import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'

import { HotelRoomService, HotelService } from './services'
import { CreateHotelDto, CreateHotelRoomDto, UpdateHotelDto } from './dto'
import { ICreateHotelResponse, ICreateHotelRoomResponse, ISearchHotelParams, ISearchHotelResponse, IUpdateHotelResponse } from './types'
import { JwtAuthGuard } from '@src/auth/guards'
import { Roles } from '@src/auth/decorators'
import { USER_ROLE } from '@src/auth/constants'

@Controller()
@UseGuards(JwtAuthGuard)
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomService: HotelRoomService
  ) {}

  // Добавление гостиницы   
  @Post('admin/hotels')
  @Roles(USER_ROLE.ADMIN)
  async createHotel(@Body() dto: CreateHotelDto): Promise<ICreateHotelResponse> {
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
  async updateHotel(
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
  async searchHotel(@Query() params: ISearchHotelParams): Promise<ISearchHotelResponse[]> {
    const hotels = await this.hotelService.search(params)
    return hotels.map(hotel => ({
      id: hotel._id.toString(),
      title: hotel.title,
      description: hotel.description
    }))
  }

  // Добавление номера 
  @Post('admin/hotel-rooms')
  @Roles(USER_ROLE.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  async createRoom(
    @Body() dto: CreateHotelRoomDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ICreateHotelRoomResponse> {
    const hotel = await this.hotelService.findById(dto.hotelId)
    const room = await this.roomService.create(dto, files)
    return {
      id: room._id.toString(),
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: {
        id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description
      }
    }
  }
}
