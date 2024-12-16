import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common'

import { ReservationService } from './reservation.service'
import { CreateReservationDto } from './dto'
import { ReservationResponseInterceptor } from './interceptors'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { ParseObjectIdPipe } from '@src/common/pipes'
import { AuthUser, Roles } from '@src/auth/decorators'
import { UserDocument } from '@src/user/schemas'
import { USER_ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'

@Controller()
@UseGuards(JwtAuthRoleGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Бронирование номера 
  @Post('client/reservations')
  @Roles(USER_ROLE.CLIENT)
  @UseInterceptors(ReservationResponseInterceptor)
  async create(
    @Body() dto: CreateReservationDto,
    @AuthUser() user: UserDocument
  ) {
    return await this.reservationService.create(dto, user)
  }

  // Список броней текущего пользователя
  @Get('client/reservations')
  @Roles(USER_ROLE.CLIENT)
  @UseInterceptors(ReservationResponseInterceptor)
  async get(@AuthUser() user: UserDocument) {
    return await this.reservationService.get(user)
  }

  // Отмена бронирования клиентом
  @Delete('client/reservations/:id')
  @Roles(USER_ROLE.CLIENT)
  async delete(
    @Param('id', ParseObjectIdPipe) id: ID,
    @AuthUser() user: UserDocument
  ) {
    return await this.reservationService.delete(id, user.id)
  }

}