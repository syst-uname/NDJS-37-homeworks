import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Hotel, HotelDocument } from './schemas'
import { CreateHotelDto } from './dto'

@Injectable()
export class HotelService {

  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  /** Добавление отеля */
  async create(dto: CreateHotelDto): Promise<HotelDocument> {
    try {
      const hotel = new this.hotelModel(dto)
      return await hotel.save()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при добавлении отеля: ${e.message}`)
    }
  }
}
