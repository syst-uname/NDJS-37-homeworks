import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { SupportRequestService } from './support-request.service'
import { ISupportRequestClientService } from '../interfaces'
import { CreateSupportRequestDto, MarkMessagesAsReadDto } from '../dto'
import { SupportRequestDocument } from '../schemas'
import { ID } from '@src/common/types'

@Injectable()
export class SupportRequestClientService extends SupportRequestService implements ISupportRequestClientService {

  /** Создание обращения в поддержку */
  async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequestDocument> {
    try {
      const request = new this.supportRequestModel({
        user: data.user,
        createdAt: new Date(),
        messages: [{
          author: data.user,
          sentAt: new Date(),
          text: data.text,
        }],
        isActive: true
      })
      return await request.save()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при создании обращения: ${e.message}`)
    }
  }

  /** Отправка события, что сообщения прочитаны */
  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    return super.markMessagesAsRead(params)
  }

  /** Количество непрочитанных сообщении от поддержки */
  async getUnreadCount(supportRequest: ID): Promise<number> {
    return super.getUnreadCount(supportRequest, 'answer')
  }

}
