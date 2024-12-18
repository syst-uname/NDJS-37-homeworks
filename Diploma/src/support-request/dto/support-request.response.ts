/** Интерфейс вывода данных обращения */
export interface ISupportRequestResponse {
  id: string,
  createdAt: string,
  isActive: boolean,
  hasNewMessages: boolean,
}
