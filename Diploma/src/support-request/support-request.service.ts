import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { SupportRequest, SupportRequestDocument } from './schemas'
import { CreateSupportRequestDto } from './dto'
import { UserDocument } from '@src/user/schemas'

@Injectable()
export class SupportRequestService {

  constructor(@InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument>) {}

  /** Создание обращения в поддержку */
  async create(dto: CreateSupportRequestDto, user: UserDocument): Promise<SupportRequestDocument> {
    try {
      const hotel = new this.supportRequestModel({
        user: user._id,
        createdAt: new Date(),
        messages: [{
          author: user._id,
          sentAt: new Date(),
          text: dto.text,
        }],
        isActive: true
      })
      return await hotel.save()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при создании обращения: ${e.message}`)
    }
  }

}
