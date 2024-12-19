import { SupportRequestDocument } from '../schemas'
import { GetChatListParams } from '../dto'
import { ID } from '@src/common/types'

/** Интерфейс сервиса обращений в поддержку */
export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]>
  // sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID): Promise<SupportRequestDocument>
  // subscribe(
  //   handler: (supportRequest: SupportRequest, message: Message) => void
  // ): () => void;
}