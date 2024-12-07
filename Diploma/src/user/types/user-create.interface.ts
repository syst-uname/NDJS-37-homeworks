import { IRegisterClientResponse } from 'src/auth/types/auth.interface'
import { ROLE } from '../constants/user.constants'

/** Ответ при создании пользователя */
export interface ICreateUserResponse extends IRegisterClientResponse {
  contactPhone: string,
  role: ROLE,
}