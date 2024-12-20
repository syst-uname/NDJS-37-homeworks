import { IHotelResponse } from './hotel.response'

/** Интерфейс вывода данных номера */
export interface IHotelRoomResponse {
  id: string,
  description?: string,
  images?: string[],
  isEnabled: boolean,
  hotel: IHotelResponse
}