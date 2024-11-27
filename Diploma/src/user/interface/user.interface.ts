import { UserDocument } from '../schemas/user.schema'

export interface IUserCreateResponse {
  id: UserDocument['_id'],
  email: UserDocument['email'],
  name: UserDocument['name'],
  contactPhone: UserDocument['contactPhone'],
  role: UserDocument['role'],
}