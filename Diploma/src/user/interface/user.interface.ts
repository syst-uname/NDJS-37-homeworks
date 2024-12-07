import { IRegisterClientResponse } from 'src/auth/interface/auth.interface'
import { ROLE } from '../constants/user.constants'

/** Ответ при создании пользователя */
export interface ICreateUserResponse extends IRegisterClientResponse {
  contactPhone: string,
  role: ROLE,
}

/** Результат поиска пользователя */
export interface IFindUserResponse {
  id: string,
  email: string,
  name: string,
  contactPhone: string,
}