import { IHotelResponse } from './hotel.interface'

/** Интерфейс вывода данных номера */
export interface IHotelRoomResponse {
  id: string,
  description?: string,
  images?: string[],
  isEnabled: boolean,
  hotel: IHotelResponse
}