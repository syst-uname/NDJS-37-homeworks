import { MarkMessagesAsReadDto } from '../dto'

/** Интерфейс сервиса обращений в поддержку для клиента */
export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
  // getUnreadCount(supportRequest: ID): Promise<number>;
  // closeRequest(supportRequest: ID): Promise<void>;
}