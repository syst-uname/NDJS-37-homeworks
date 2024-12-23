import { CreateReservationDto, ReservationSearchParams } from '../dto'
import { ReservationDocument } from '../schemas'
import { ID } from '@src/common/types'

/** Интерфейс сервиса обращений в поддержку для клиента */
export interface IReservationService {
  addReservation(data: CreateReservationDto): Promise<ReservationDocument>;
  removeReservation(id: ID): Promise<void>;
  getReservations(filter: ReservationSearchParams): Promise<ReservationDocument[]>;
}