import { Injectable } from '@nestjs/common'

import { SupportRequestService } from './support-request.service'
import { ISupportRequestEmployeeService } from '../interfaces'
import { MarkMessagesAsReadDto } from '../dto'

@Injectable()
export class SupportRequestEmployeeService extends SupportRequestService implements ISupportRequestEmployeeService {

  /** Отправка события, что сообщения прочитаны */
  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    return super.markMessagesAsRead(params)
  }

}
