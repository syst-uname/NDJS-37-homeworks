import { UserDocument } from 'src/user/schemas/user.schema'

export interface IClientRegisterResponse {
  id: UserDocument['_id'],
  email: UserDocument['email'],
  name: UserDocument['name'],
}