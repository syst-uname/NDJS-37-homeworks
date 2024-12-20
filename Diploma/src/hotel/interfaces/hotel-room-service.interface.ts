import { CreateHotelRoomDto, SearchRoomsParams, UpdateHotelRoomBodyDto } from '../dto'
import { HotelRoomDocument } from '../schemas'
import { ID } from '@src/common/types'

/** Интерфейс сервиса номера отеля */
export interface IHotelRoomService {
  create(data: CreateHotelRoomDto): Promise<HotelRoomDocument>;
  findById(id: ID): Promise<HotelRoomDocument>;
  search(params: SearchRoomsParams): Promise<HotelRoomDocument[]>;
  update(id: ID, data: UpdateHotelRoomBodyDto): Promise<HotelRoomDocument>;
}