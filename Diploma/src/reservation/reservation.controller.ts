import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common'

import { ReservationService } from './reservation.service'
import { CreateReservationBodyDto } from './dto'
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
  async addReservation(
    @Body() body: CreateReservationBodyDto,
    @User() user: UserDocument
  ) {
    return await this.reservationService.addReservation({
      ...body,
      userId: user._id as ID
    })
  }

  // Список броней текущего пользователя
  @Get('client/reservations')
  @Roles(ROLE.CLIENT)
  @UseInterceptors(ReservationResponseInterceptor)
  async get(@User() user: UserDocument) {
    return await this.reservationService.getReservations({ userId: user._id as ID})
  }

  // Отмена бронирования клиентом
  @Delete('client/reservations/:id')
  @Roles(ROLE.CLIENT)
  async removeReservationForClient(
    @Param('id', ParseObjectIdPipe) id: ID,
    @User() user: UserDocument
  ) {
    await this.reservationService.checkClientAccess(id, user)
    return await this.reservationService.removeReservation(id)
  }

  // Список броней конкретного пользователя
  @Get('manager/reservations/:userId')
  @Roles(ROLE.MANAGER)
  @UseInterceptors(ReservationResponseInterceptor)
  async getByUserId(@Param('userId', ParseObjectIdPipe) userId: ID) {
    return await this.reservationService.getReservations({ userId })
  }

  // Отмена бронирования менеджером
  @Delete('manager/reservations/:id')
  @Roles(ROLE.MANAGER)
  async removeReservationForManager(@Param('id', ParseObjectIdPipe) id: ID) {
    return await this.reservationService.removeReservation(id)
  }

}