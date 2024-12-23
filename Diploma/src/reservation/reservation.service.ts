import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { IReservationService } from './interfaces'
import { Reservation, ReservationDocument } from './schemas'
import { UserDocument } from '@src/user/schemas'
import { CreateReservationDto, ReservationSearchParams } from './dto'
import { ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'

@Injectable()
export class ReservationService implements IReservationService {

  constructor(@InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>) {}

  /** Бронирование номера */
  async addReservation(data: CreateReservationDto): Promise<ReservationDocument> {
    try {
      // даты валидны
      if (data.startDate > data.endDate)
        throw new BadRequestException('Дата начала бронирования не может быть больше даты окончания')

      // номер не занят
      const existingReservation = await this.reservationModel.findOne({
        roomId: data.hotelRoom,
        $and: [{
          dateStart: { $lte: data.endDate },      // перекрытие дат
          dateEnd: { $gte: data.startDate }
        }],
      })
      if (existingReservation)
        throw new BadRequestException('Номер уже занят')

      // создание бронирования
      const reservation = new this.reservationModel({
        userId: data.userId,
        roomId: data.hotelRoom,
        dateStart: data.startDate,
        dateEnd: data.endDate
      })
      await reservation.populate('userId')
      await reservation.populate('roomId')
      if (!reservation.roomId)
        throw new BadRequestException(`Номер с id "${data.hotelRoom}" не найден`)
      if (!reservation.roomId.isEnabled)
        throw new BadRequestException(`Номер с id "${data.hotelRoom}" недоступен`)
      reservation.hotelId = reservation.roomId.hotel    // id отеля из данных номера 
      await reservation.populate('hotelId')
      return await reservation.save()
    } catch (e) {
      console.error(e.message, e.stack)
      if (e instanceof BadRequestException) {
        throw e
      }
      throw new InternalServerErrorException(`Ошибка при бронировании номера: ${e.message}`)
    }
  }

  /** Список броней пользователя */
  async getReservations(filter: ReservationSearchParams): Promise<ReservationDocument[]> {
    try {
      const query: any = { userId: filter.userId }
      if (filter.dateStart) {
        query.dateStart = { $gte: filter.dateStart }
      }
      if (filter.dateEnd) {
        query.dateEnd = { $lte: filter.dateEnd }
      }
      return await this.reservationModel
        .find(query)
        .populate('userId')
        .populate('roomId')
        .populate('hotelId')
        .exec()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при получении бронирований: ${e.message}`)
    }
  }

  /** Отмена бронирования клиента */
  async removeReservation(id: ID): Promise<void> {
    try {
      await this.reservationModel.deleteOne({ _id: id })
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при отмене бронирования: ${e.message}`)
    }
  }

  /** Получение бронирования по id */
  async findById(id: ID): Promise<ReservationDocument> {
    const reservation = await this.reservationModel
      .findById(id)
      .populate('userId')
      .populate('roomId')
      .populate('hotelId')
    if (!reservation) {
      throw new NotFoundException(`Бронирование с id "${id}" не найдено`)
    }
    return reservation
  }

  /** Проверка доступа брони */
  async checkClientAccess(reservationId: ID, user: UserDocument): Promise<boolean> {
    if (user.role === ROLE.CLIENT) {
      const reservation = await this.findById(reservationId)
      if (user.id !== reservation.userId.id) {
        throw new ForbiddenException('Нет доступа к данному бронированию')
      }
    }
    return true
  }

}
