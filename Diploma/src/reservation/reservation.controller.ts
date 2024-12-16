import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common'

import { ReservationService } from './reservation.service'
import { CreateReservationDto } from './dto'
import { ReservationResponseInterceptor } from './interceptors'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { AuthUser, Roles } from '@src/auth/decorators'
import { UserDocument } from '@src/user/schemas'
import { USER_ROLE } from '@src/auth/constants'

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

}