import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Reservation, ReservationDocument } from './schemas'
import { CreateReservationDto } from './dto'
import { UserDocument } from '@src/user/schemas'

@Injectable()
export class ReservationService {

  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
  ) {}

  /** Бронирование номера */
  async create(dto: CreateReservationDto, user: UserDocument): Promise<ReservationDocument> {
    try {
      // даты валидны
      if (dto.startDate > dto.endDate)
        throw new BadRequestException('Дата начала бронирования не может быть больше даты окончания')

      // номер не занят
      const existingReservation = await this.reservationModel.findOne({
        roomId: dto.hotelRoom,
        $and: [{
          dateStart: { $lte: dto.endDate },      // перекрытие дат
          dateEnd: { $gte: dto.startDate }
        }],
      })
      if (existingReservation)
        throw new BadRequestException('Номер уже занят')

      // создание бронирования
      const reservation = new this.reservationModel({
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
