import { UserDocument } from '../schemas'
import { CreateUserDto, SearchUserParams } from '../dto'
import { ID } from '@src/common/types'

/** Интерфейс сервиса пользователей */
export interface IUserService {
  create(data: CreateUserDto): Promise<UserDocument>;
  findById(id: ID): Promise<UserDocument>;
  findByEmail(email: string): Promise<UserDocument>;
  findAll(params: SearchUserParams): Promise<UserDocument[]>;
}