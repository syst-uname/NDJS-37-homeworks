import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as fs from 'fs'
import * as path from 'path'

import config from '@src/config'
import { IHotelRoomService } from '../interfaces'
import { HotelService } from './hotel.service'
import { HotelRoom, HotelRoomDocument } from '../schemas'
import { CreateHotelRoomDto, SearchRoomsParams, UpdateHotelRoomDto } from '../dto'
import { ID } from '@src/common/types'

@Injectable()
export class HotelRoomService implements IHotelRoomService {

  constructor(
    @InjectModel(HotelRoom.name) private roomModel: Model<HotelRoomDocument>,
    private readonly hotelService: HotelService,
  ) {}

  /** Добавление номера */
  async create(data: CreateHotelRoomDto): Promise<HotelRoomDocument> {
    try {
      const room = await new this.roomModel({
        hotel: data.hotelId,
        description: data.description,
        isEnabled: true
      }).populate('hotel')

      if (!room.hotel) {
        throw new NotFoundException(`Гостиница с id "${data.hotelId}" не найдена`)
      }

      room.images = await this.uploadImages(room, data.images)
      return await room.save()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при добавлении номера: ${e.message}`)
    }
  }

  /** Обновление номера */
  async update(id: ID, data: UpdateHotelRoomDto): Promise<HotelRoomDocument> {
    try {
      const room = await this.findById(id)
      if (data.hotelId && room.hotel.id !== data.hotelId) {
        room.hotel = await this.hotelService.findById(data.hotelId)
      }
      room.description = data.description
      room.isEnabled = data.isEnabled

      const images = await this.uploadImages(room, data.images)
      room.images = Array.from(new Set([...room.images, ...images]))
      return await room.save()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при добавлении номера: ${e.message}`)
    }
  }

  /** Сохранение изображений на сервере */
  private async uploadImages(room: HotelRoomDocument, files: Express.Multer.File[]): Promise<string[]> {
    if (!files.length) {
      return []
    }
    // папка: id_гостиницы/id_номера/[изображения]
    const roomDir = path.join(config.server.uploadsHotelsDir, room.hotel.id, room.id)
    fs.mkdirSync(roomDir, { recursive: true })

    const savedImagePaths = await Promise.all(
      files.map(async (file) => {
        const imagePath = path.join(roomDir, file.originalname)
        fs.writeFileSync(imagePath, file.buffer)
        return path.relative(config.server.uploadsHotelsDir, imagePath)   // относительный путь без 'uploads/hotels'
      })
    )
    return savedImagePaths
  }

  /** Поиск номеров */
  async search(params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
    try {
      const query = this.roomModel.find()
      if (params.hotel) {
        query.where('hotel').equals(params.hotel)
      }
      if (params.isEnabled) {
        query.where('isEnabled').equals(params.isEnabled)
      }
      return await query
        .limit(params.limit)
        .skip(params.offset)
        .populate('hotel')
        .exec()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при поиске номеров: ${e.message}`)
    }
  }

  /** Получение номера по id */
  async findById(id: ID): Promise<HotelRoomDocument> {
    const room = await this.roomModel.findById(id).populate('hotel')
    if (!room) {
      throw new NotFoundException(`Номер с id "${id}" не найден`)
    }
    return room
  }
}
