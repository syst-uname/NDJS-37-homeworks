import { User } from '../schemas/user.schema'

export class CreateUserDto {
  email: User['email']
  password: User['password']
  firstName: User['firstName']
  lastName: User['lastName']
}