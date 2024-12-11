import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as fs from 'fs'
import * as path from 'path'

import config from '@src/config'
import { HotelService } from './hotel.service'
import { HotelRoom, HotelRoomDocument } from '../schemas'
import { CreateHotelRoomDto } from '../dto'
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
      await this.hotelService.findById(dto.hotelId)   // гостиница должна существовать
      const room = new this.roomModel({
        hotel: dto.hotelId,
        description: dto.description,
        isEnabled: true
      })
      room.images = await this.uploadImages(room, files)
      return await room.save()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при добавлении номера: ${e.message}`)
    }
  }

  /** Сохранение изображений на сервере */
  private async uploadImages(room: HotelRoomDocument, files: Express.Multer.File[]): Promise<string[]> {
    // папка: id_гостиницы/id_номера/[изображения]
    const roomDir = path.join(config.server.uploadsDirHotels, room.hotel, room.id)
    fs.mkdirSync(roomDir, { recursive: true })

    const savedImagePaths = await Promise.all(
      files.map(async (file) => {
        const imagePath = path.join(roomDir, file.originalname)
        fs.writeFileSync(imagePath, file.buffer)
        return imagePath
      })
    )
    return savedImagePaths
  }

  /** Получение номера по id */
  async findById(id: ID): Promise<HotelRoomDocument> {
    const room = await this.roomModel.findById(id)
    if (!room) {
      throw new NotFoundException(`Номер с id "${id}" не найден`)
    }
    return room
  }
}
