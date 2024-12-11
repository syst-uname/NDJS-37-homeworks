import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'

import { HotelRoomService, HotelService } from './services'
import { CreateHotelDto, CreateHotelRoomDto, UpdateHotelDto } from './dto'
import { HotelResponseInterceptor, HotelRoomResponseInterceptor } from './interceptors'
import { ISearchHotelParams, ISearchHotelRoomParams } from './types'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { Roles } from '@src/auth/decorators'
import { USER_ROLE } from '@src/auth/constants'

@Controller()
@UseGuards(JwtAuthRoleGuard)
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomService: HotelRoomService
  ) {}

  // Добавление гостиницы   
  @Post('admin/hotels')
  @Roles(USER_ROLE.ADMIN)
  @UseInterceptors(HotelResponseInterceptor)
  async createHotel(@Body() dto: CreateHotelDto) {
    return await this.hotelService.create(dto)
  }

  // Изменение гостиницы   
  @Post('admin/hotels/:id')
  @Roles(USER_ROLE.ADMIN)
  @UseInterceptors(HotelResponseInterceptor)
  async updateHotel(
    @Param('id') id: string,
    @Body() dto: UpdateHotelDto
  ) {
    return await this.hotelService.update(id, dto)
  }

  // Получение списка гостиниц   
  @Get('admin/hotels')
  @Roles(USER_ROLE.ADMIN)
  @UseInterceptors(HotelResponseInterceptor)
  async searchHotel(@Query() params: ISearchHotelParams) {
    return await this.hotelService.search(params)
  }


  // Добавление номера 
  @Post('admin/hotel-rooms')
  @Roles(USER_ROLE.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  @UseInterceptors(HotelRoomResponseInterceptor)
  async createRoom(
    @Body() dto: CreateHotelRoomDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return await this.roomService.create(dto, files)
  }

  // Информация о номере
  @Get('/common/hotel-rooms/:id')
  @UseInterceptors(HotelRoomResponseInterceptor)
  async getRoom(@Param('id') id: string) {
    return await this.roomService.findById(id)
  }

  //	Поиск номеров 
  @Get('/common/hotel-rooms')
  @UseInterceptors(HotelRoomResponseInterceptor)
  async searchRoom(@Query() params: ISearchHotelRoomParams) {
    return await this.roomService.search(params)
  }
}
