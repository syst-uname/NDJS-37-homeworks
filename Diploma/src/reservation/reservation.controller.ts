import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common'

import { ReservationService } from './reservation.service'
import { CreateReservationDto } from './dto'
import { ReservationResponseInterceptor } from './interceptors'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { ParseObjectIdPipe } from '@src/common/pipes'
import { User, Roles } from '@src/auth/decorators'
import { UserDocument } from '@src/user/schemas'
import { ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'

@Controller()
@UseGuards(JwtAuthRoleGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Бронирование номера 
  @Post('client/reservations')
  @Roles(ROLE.CLIENT)
  @UseInterceptors(ReservationResponseInterceptor)
  async create(
    @Body() dto: CreateReservationDto,
    @User() user: UserDocument
  ) {
    return await this.reservationService.create(dto, user)
  }

  // Список броней текущего пользователя
  @Get('client/reservations')
  @Roles(ROLE.CLIENT)
  @UseInterceptors(ReservationResponseInterceptor)
  async get(@User() user: UserDocument) {
    return await this.reservationService.get(user._id as ID)
  }

  // Отмена бронирования клиентом
  @Delete('client/reservations/:id')
  @Roles(ROLE.CLIENT)
  async delete(
    @Param('id', ParseObjectIdPipe) id: ID,
    @User() user: UserDocument
  ) {
    return await this.reservationService.remove(id, user.id)
  }

  // Список броней конкретного пользователя
  @Get('manager/reservations/:userId')
  @Roles(ROLE.MANAGER)
  @UseInterceptors(ReservationResponseInterceptor)
  async getByUserId(@Param('userId', ParseObjectIdPipe) userId: ID) {
    return await this.reservationService.get(userId)
  }

  // Отмена бронирования менеджером
  @Delete('manager/reservations/:id')
  @Roles(ROLE.MANAGER)
  async deleteById(@Param('id', ParseObjectIdPipe) id: ID) {
    return await this.reservationService.remove(id)
  }

}