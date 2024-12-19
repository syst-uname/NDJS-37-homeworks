import { CreateSupportRequestDto, MarkMessagesAsReadDto } from '../dto'
import { SupportRequestDocument } from '../schemas'

/** Интерфейс сервиса обращений в поддержку для клиента */
export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequestDocument>
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
  // getUnreadCount(supportRequest: ID): Promise<number>
}