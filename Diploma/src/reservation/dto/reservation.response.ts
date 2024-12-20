/** Интерфейс вывода данных бронирования */
export interface IReservationResponse {
  startDate: string,
  endDate: string,
  hotelRoom: IHotelRoomResponse,
  hotel: IHotelResponse,
}

/** Интерфейс вывода данных номера в бронировании */
interface IHotelRoomResponse {
  description?: string,
  images?: string[],
}

/** Интерфейс вывода данных отеля в бронировании */
interface IHotelResponse {
  title: string,
  description?: string,
}