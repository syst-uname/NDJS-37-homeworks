import { Body, Controller, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'

import { HotelRoomService, HotelService } from './services'
import { CreateHotelDto, CreateHotelRoomDto, UpdateHotelDto, UpdateHotelRoomDto } from './dto'
import { HotelResponseInterceptor, HotelRoomResponseInterceptor } from './interceptors'
import { ISearchHotelParams, ISearchHotelRoomParams } from './types'
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
  async createHotel(@Body() dto: CreateHotelDto) {
    return await this.hotelService.create(dto)
  }

  // Изменение гостиницы   
  @Post('admin/hotels/:id')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(HotelResponseInterceptor)
  async updateHotel(
    @Param('id', ParseObjectIdPipe) id: ID,
    @Body() dto: UpdateHotelDto
  ) {
    return await this.hotelService.update(id, dto)
  }

  // Получение списка гостиниц   
  @Get('admin/hotels')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(HotelResponseInterceptor)
  async searchHotel(@Query() params: ISearchHotelParams) {
    return await this.hotelService.search(params)
  }


  // Добавление номера 
  @Post('admin/hotel-rooms')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  @UseInterceptors(HotelRoomResponseInterceptor)
  async createRoom(
    @Body() dto: CreateHotelRoomDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return await this.roomService.create(dto, files)
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
  async searchRoom(@Query() params: ISearchHotelRoomParams) {
    return await this.roomService.search(params)
  }

  // Изменение номера 
  @Put('admin/hotel-rooms/:id')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  @UseInterceptors(HotelRoomResponseInterceptor)
  async updateRoom(
    @Param('id', ParseObjectIdPipe) id: ID,
    @Body() dto: UpdateHotelRoomDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return await this.roomService.update(id, dto, files)
  }
}
