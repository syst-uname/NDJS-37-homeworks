import { IRegisterClientResponse } from '@src/auth/types'
import { ROLE } from '@src/auth/constants'

/** Ответ при создании пользователя */
export interface ICreateUserResponse extends IRegisterClientResponse {
  contactPhone?: string,
  role: ROLE,
}