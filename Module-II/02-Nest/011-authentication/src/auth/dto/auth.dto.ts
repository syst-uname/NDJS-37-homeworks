import { User } from 'src/user/schemas/user.schema'

export class SignupDto {
  email: User['email']
  password: User['password']
  firstName: User['firstName']
  lastName: User['lastName']
}

export class SigninDto {
  email: User['email']
  password: User['password']
}