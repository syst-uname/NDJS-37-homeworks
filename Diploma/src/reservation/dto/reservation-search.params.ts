import { ID } from '@src/common/types'

/** Параметры поиска отелей */
export class ReservationSearchParams {
  userId: ID
  dateStart?: Date
  dateEnd?: Date
}