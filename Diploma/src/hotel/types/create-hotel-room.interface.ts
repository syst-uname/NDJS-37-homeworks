import { ISearchHotelResponse } from './search-hotel.interface'

/** Ответ при добавлении номера */
export interface ICreateHotelRoomResponse {
  id: string,
  description?: string,
  images?: string[],
  isEnabled: boolean,
  hotel: ISearchHotelResponse
}