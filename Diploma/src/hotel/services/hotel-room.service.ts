import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as fs from 'fs'
import * as path from 'path'

import config from '@src/config'
import { HotelService } from './hotel.service'
import { HotelRoom, HotelRoomDocument } from '../schemas'
import { ISearchHotelRoomParams } from '../types'
import { CreateHotelRoomDto, UpdateHotelRoomDto } from '../dto'
import { ID } from '@src/common/types'

@Injectable()
export class HotelRoomService {

  constructor(
    @InjectModel(HotelRoom.name) private roomModel: Model<HotelRoomDocument>,
    private readonly hotelService: HotelService,
  ) {}

  /** Добавление номера */
  async create(dto: CreateHotelRoomDto, files: Express.Multer.File[]): Promise<HotelRoomDocument> {
    try {
      const room = await new this.roomModel({
        hotel: dto.hotelId,
        description: dto.description,
        isEnabled: true
      }).populate('hotel')

      if (!room.hotel) {
        throw new NotFoundException(`Гостиница с id "${dto.hotelId}" не найдена`)
      }

      room.images = await this.uploadImages(room, files)
      return await room.save()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при добавлении номера: ${e.message}`)
    }
  }

  /** Обновление номера */
  async update(id: ID, dto: UpdateHotelRoomDto, files: Express.Multer.File[]): Promise<HotelRoomDocument> {
    try {
      const room = await this.findById(id)
      if (dto.hotelId && room.hotel.id !== dto.hotelId) {
        room.hotel = await this.hotelService.findById(dto.hotelId)
      }
      room.description = dto.description
      room.isEnabled = dto.isEnabled

      const images = await this.uploadImages(room, files)
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
    const roomDir = path.join(config.server.uploadsDirHotels, room.hotel.id, room.id)
    fs.mkdirSync(roomDir, { recursive: true })

    const savedImagePaths = await Promise.all(
      files.map(async (file) => {
        const imagePath = path.join(roomDir, file.originalname)
        fs.writeFileSync(imagePath, file.buffer)
        return path.relative(config.server.uploadsDirHotels, imagePath)   // относительный путь без 'uploads/hotels'
      })
    )
    return savedImagePaths
  }

  /** Поиск номеров */
  async search(params: ISearchHotelRoomParams): Promise<HotelRoomDocument[]> {
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