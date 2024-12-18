import { CreateSupportRequestDto } from '../dto'
import { SupportRequestDocument } from '../schemas'

/** Интерфейс сервиса обращений в поддержку для клиента */
export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequestDocument>
  // markMessagesAsRead(params: MarkMessagesAsReadDto)
  // getUnreadCount(supportRequest: ID): Promise<number>
}