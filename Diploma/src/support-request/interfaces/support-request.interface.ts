import { SupportRequestDocument } from '../schemas'
import { GetChatListParams } from '../dto'

/** Интерфейс сервиса обращений в поддержку */
export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]>;
  // sendMessage(data: SendMessageDto): Promise<Message>;
  // getMessages(supportRequest: ID): Promise<Message[]>;
  // subscribe(
  //   handler: (supportRequest: SupportRequest, message: Message) => void
  // ): () => void;
}