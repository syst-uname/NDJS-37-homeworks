import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common'

import { ReservationService } from './reservation.service'
import { CreateReservationDto } from './dto'
import { ReservationResponseIInterceptor } from './interceptors'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { AuthUser, Roles } from '@src/auth/decorators'
import { USER_ROLE } from '@src/auth/constants'
import { UserDocument } from '@src/user/schemas'

@Controller()
@UseGuards(JwtAuthRoleGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Бронирование номера 
  @Post('client/reservations')
  @Roles(USER_ROLE.CLIENT)
  @UseInterceptors(ReservationResponseIInterceptor)
  async createHotel(
    @Body() dto: CreateReservationDto,
    @AuthUser() user: UserDocument
  ) {
    return await this.reservationService.create(dto, user)
  }

}