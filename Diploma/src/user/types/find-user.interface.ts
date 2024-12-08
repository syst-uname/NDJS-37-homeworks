/** Параметры поиска пользователей */
export class IFindUsersParams {
  limit?: number
  offset?: number
  name?: string
  email?: string
  contactPhone?: string
}

/** Результат поиска пользователя */
export interface IFindUserResponse {
  id: string,
  email: string,
  name: string,
  contactPhone: string,
}