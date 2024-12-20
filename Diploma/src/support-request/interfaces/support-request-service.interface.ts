import { MessageDocument, SupportRequestDocument } from '../schemas'
import { GetChatListParams, SendMessageDto } from '../dto'
import { ID } from '@src/common/types'

/** Интерфейс сервиса обращений в поддержку */
export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]>
  sendMessage(data: SendMessageDto): Promise<MessageDocument>;
  getMessages(supportRequest: ID): Promise<SupportRequestDocument>
  // subscribe(
  //   handler: (supportRequest: SupportRequest, message: Message) => void
  // ): () => void;
}