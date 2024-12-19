import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { SupportRequestService } from './support-request.service'
import { ISupportRequestEmployeeService } from '../interfaces'
import { MarkMessagesAsReadDto } from '../dto'
import { ID } from '@src/common/types'

@Injectable()
export class SupportRequestEmployeeService extends SupportRequestService implements ISupportRequestEmployeeService {

  /** Отправка события, что сообщения прочитаны */
  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    return super.markMessagesAsRead(params)
  }

  /** Количество непрочитанных сообщений пользователя */
  async getUnreadCount(supportRequest: ID): Promise<number> {
    return super.getUnreadCount(supportRequest, 'question')
  }

  /** Закрытие обращения */
  async closeRequest(supportRequest: ID): Promise<void> {
    try {
      const request = await this.findById(supportRequest)
      request.isActive = false
      await request.save()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при закрытии обращения: ${e.message}`)
    }
  }

}
