import { IRegisterClientResponse } from '@src/auth/types'
import { USER_ROLE } from '@src/auth/constants'

/** Ответ при создании пользователя */
export interface ICreateUserResponse extends IRegisterClientResponse {
  contactPhone?: string,
  role: USER_ROLE,
}