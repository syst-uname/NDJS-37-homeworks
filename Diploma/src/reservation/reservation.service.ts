import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Reservation, ReservationDocument } from './schemas'
import { CreateReservationDto } from './dto'
import { UserDocument } from '@src/user/schemas'
import { ID } from '@src/common/types'

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
      console.error(e.message, e.stack)
      if (e instanceof BadRequestException) {
        throw e
      }
      throw new InternalServerErrorException(`Ошибка при бронировании номера: ${e.message}`)
    }
  }

  /** Список броней пользователя */
  async get(userId: ID): Promise<ReservationDocument[]> {
    try {
      return await this.reservationModel
        .find({ userId })
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
  async remove(id: ID, userId?: ID) {
    try {
      const reservation = await this.findById(id)
      // проверяем на пользователя, если он передан (менеджер пользователя не передаст и не проверит)  
      if (userId && reservation.userId.id !== userId)
        throw new ForbiddenException('Вы не можете отменить бронирование другого пользователя')
      await this.reservationModel.deleteOne({ _id: id })
    } catch (e) {
      console.error(e.message, e.stack)
      if (e instanceof ForbiddenException || e instanceof NotFoundException) {
        throw e
      }
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
}
