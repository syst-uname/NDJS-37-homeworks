import { CreateHotelDto, SearchHotelParams, UpdateHotelDto } from '../dto'
import { HotelDocument } from '../schemas'
import { ID } from '@src/common/types'

/** Интерфейс сервиса отеля */
export interface IHotelService {
  create(data: CreateHotelDto): Promise<HotelDocument>;
  findById(id: ID): Promise<HotelDocument>;
  search(params: SearchHotelParams): Promise<HotelDocument[]>;
  update(id: ID, data: UpdateHotelDto): Promise<HotelDocument>;
}