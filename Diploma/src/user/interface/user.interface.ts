import { UserDocument } from '../schemas/user.schema'
import { IClientRegisterResponse } from 'src/auth/interface/auth.interface'

export interface IUserCreateResponse extends IClientRegisterResponse {
  contactPhone: UserDocument['contactPhone'],
  role: UserDocument['role'],
}