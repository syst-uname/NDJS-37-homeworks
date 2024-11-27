import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User, UserDocument } from './schemas/user.schema'
import { UserCreateDto } from './dto/user.dto'
import { IUserCreateResponse } from './interface/user.interface'
import { hashPassword } from 'src/utils/password.utils'

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  async create(dto: UserCreateDto): Promise<IUserCreateResponse> {
    try {
      const user = new this.UserModel({
        email: dto.email,
        passwordHash: await hashPassword(dto.password),
        name: dto.name,
        contactPhone: dto.contactPhone,
        role: dto.role
      })
      await user.save()

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
        role: user.role
      }
    } catch (e) {
      console.error(e.message, e.stack)
      throw new HttpException(`Ошибка при создании пользователя: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return await this.UserModel.findOne({ email })
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email)
    return user && (user.passwordHash === password )
  }
}
