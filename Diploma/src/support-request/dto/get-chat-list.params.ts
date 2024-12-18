import { ID } from '@src/common/types'

/** Параметры получения списка обращений */
export class GetChatListParams {
  user?: ID
  limit?: number
  offset?: number
  isActive?: boolean
}