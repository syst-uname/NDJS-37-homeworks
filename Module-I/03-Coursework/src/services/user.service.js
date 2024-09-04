import { UserModel } from '../models/index.js'
import { HttpException } from '../exceptions/index.js'
import { hashPassword, verifyPassword } from '../config/bcrypt.js'

class UserService {
  async findByEmail(email) {
    try {
      const user = await UserModel.findOne({ email }, { passwordHash: 0, __v: 0 }).lean()
      return user
    } catch (error) {
      return null
    }
  }

  async verifyPassword(email, password) {
    try {
      const user = await UserModel.findOne({ email }).lean()   // тут нужен с паролем 
      if (user) {
        return await verifyPassword(password, user.passwordHash)
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  async create(body) {
    const existUser = await this.findByEmail(body.email)
    if (existUser) {
      throw new HttpException(400, 'Пользователь с таким email уже зарегистрирован')
    }
    if (body.password.length < 2) {
      throw new HttpException(400, 'Пароль слишком короткий')
    }

    try {
      const user = new UserModel({
        email: body.email,
        passwordHash: await hashPassword(body.password),
        name: body.name,
        contactPhone: body.contactPhone,
      })
      await user.save()
      return this.findByEmail(body.email)
    } catch (error) {
      throw new HttpException(500, `Ошибка при регистрации ${body.email}: ${error.message}`)
    }
  }
}

export default new UserService()