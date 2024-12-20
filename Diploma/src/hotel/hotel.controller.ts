import { Body, Controller, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'

import { HotelRoomService, HotelService } from './services'
import { CreateHotelDto, CreateHotelRoomBodyDto, SearchHotelParams, SearchRoomsParams, UpdateHotelDto, UpdateHotelRoomBodyDto } from './dto'
import { HotelResponseInterceptor, HotelRoomResponseInterceptor } from './interceptors'
import { ParseObjectIdPipe } from '@src/common/pipes'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { RoomEnabledGuard } from './guards'
import { Roles } from '@src/auth/decorators'
import { ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'

@Controller()
@UseGuards(JwtAuthRoleGuard)
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomService: HotelRoomService
  ) {}

  // Добавление гостиницы   
  @Post('admin/hotels')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(HotelResponseInterceptor)
  async createHotel(@Body() body: CreateHotelDto) {
    return await this.hotelService.create(body)
  }

  // Изменение гостиницы   
  @Post('admin/hotels/:id')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(HotelResponseInterceptor)
  async updateHotel(
    @Param('id', ParseObjectIdPipe) id: ID,
    @Body() body: UpdateHotelDto
  ) {
    return await this.hotelService.update(id, body)
  }

  // Получение списка гостиниц   
  @Get('admin/hotels')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(HotelResponseInterceptor)
  async searchHotel(@Query() params: SearchHotelParams) {
    return await this.hotelService.search(params)
  }


  // Добавление номера 
  @Post('admin/hotel-rooms')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  @UseInterceptors(HotelRoomResponseInterceptor)
  async createRoom(
    @Body() body: CreateHotelRoomBodyDto,
    @UploadedFiles() images: Express.Multer.File[]
  ) {
    return await this.roomService.create({ ...body, images })
  }

  // Информация о номере
  @Get('common/hotel-rooms/:id')
  @UseInterceptors(HotelRoomResponseInterceptor)
  async getRoom(@Param('id', ParseObjectIdPipe) id: ID) {
    return await this.roomService.findById(id)
  }

  //	Поиск номеров 
  @Get('common/hotel-rooms')
  @UseGuards(RoomEnabledGuard)
  @UseInterceptors(HotelRoomResponseInterceptor)
  async searchRoom(@Query() params: SearchRoomsParams) {
    return await this.roomService.search(params)
  }

  // Изменение номера 
  @Put('admin/hotel-rooms/:id')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  @UseInterceptors(HotelRoomResponseInterceptor)
  async updateRoom(
    @Param('id', ParseObjectIdPipe) id: ID,
    @Body() body: UpdateHotelRoomBodyDto,
    @UploadedFiles() images: Express.Multer.File[]
  ) {
    return await this.roomService.update(id, { ...body, images })
  }
}
