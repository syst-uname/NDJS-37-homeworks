import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Reservation, ReservationDocument } from './schemas'
import { CreateReservationDto } from './dto'
import { UserDocument } from '@src/user/schemas'

@Injectable()
export class ReservationService {

  constructor(
    @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
  ) {}

  /** Бронирование номера */
  async create(dto: CreateReservationDto, user: UserDocument): Promise<ReservationDocument> {
    try {
      const reservation = new this.ReservationModel({
        userId: user._id,
        roomId: dto.hotelRoom,
        dateStart: dto.startDate,
        dateEnd: dto.endDate
      })
      await reservation.populate('userId')
      await reservation.populate('roomId')
      if (!reservation.roomId)
        throw new BadRequestException(`Номер с id "${dto.hotelRoom}" не найден`)
      if (!reservation.roomId.isEnabled)
        throw new BadRequestException(`Номер с id "${dto.hotelRoom}" недоступен`)
      reservation.hotelId = reservation.roomId.hotel    // id отеля из данных номера 
      await reservation.populate('hotelId')
      return await reservation.save()
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e
      }
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при добавлении гостиницы: ${e.message}`)
    }
  }

}
