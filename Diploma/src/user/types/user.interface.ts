/** Результат поиска пользователя */
export interface IUserResponse {
  id: string,
  email: string,
  name: string,
  contactPhone?: string,
}