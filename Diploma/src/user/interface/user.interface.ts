import { UserDocument } from '../schemas/user.schema'
import { IRegisterClientResponse } from 'src/auth/interface/auth.interface'

/** Ответ при создании пользователя */
export interface ICreateUserResponse extends IRegisterClientResponse {
  contactPhone: UserDocument['contactPhone'],
  role: UserDocument['role'],
}

/** Результат поиска пользователя */
export interface IFindUserResponse {
  id: UserDocument['_id'],
  email: UserDocument['email'],
  name: UserDocument['name'],
  contactPhone: UserDocument['contactPhone'],
}