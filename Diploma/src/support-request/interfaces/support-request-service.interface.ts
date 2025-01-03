import { MessageDocument, SupportRequestDocument } from '../schemas'
import { GetChatListParams, SendMessageDto } from '../dto'
import { ID } from '@src/common/types'

/** Интерфейс сервиса обращений в поддержку */
export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]>
  sendMessage(data: SendMessageDto): Promise<MessageDocument>;
  getMessages(supportRequest: ID): Promise<SupportRequestDocument>
  subscribe(
    supportRequestId: string,
    handler: (supportRequest: SupportRequestDocument, message: MessageDocument) => void
  ): () => void;
}