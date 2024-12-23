/** Интерфейс вывода данных сообщения */
export interface IMessageResponse {
  id: string,
  createdAt: string,
  text: string,
  readAt?: string,
  author: {
    id: string,
    name: string,
  }
}
