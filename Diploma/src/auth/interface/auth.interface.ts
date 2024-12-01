import { UserDocument } from 'src/user/schemas/user.schema'

/** Ответ при регистрации клиента */
export interface IRegisterClientResponse {
  id: UserDocument['_id'],
  email: UserDocument['email'],
  name: UserDocument['name'],
}