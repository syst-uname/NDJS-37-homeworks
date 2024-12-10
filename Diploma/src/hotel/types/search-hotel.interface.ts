/** Параметры поиска отелей */
export class ISearchHotelParams {
  limit?: number
  offset?: number
  title?: string
}

/** Результат поиска отеля*/
export interface ISearchHotelResponse {
  id: string,
  title: string,
  description?: string,
}