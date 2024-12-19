import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { SupportRequestService } from './support-request.service'
import { ISupportRequestClientService } from '../interfaces'
import { SupportRequestDocument } from '../schemas'
import { CreateSupportRequestDto } from '../dto'

@Injectable()
export class SupportRequestClientService extends SupportRequestService implements ISupportRequestClientService {

  /** Создание обращения в поддержку */
  async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequestDocument> {
    try {
      const hotel = new this.supportRequestModel({
        user: data.user,
        createdAt: new Date(),
        messages: [{
          author: data.user,
          sentAt: new Date(),
          text: data.text,
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