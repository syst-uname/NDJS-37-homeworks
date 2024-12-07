import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

import { User, UserDocument } from './schemas/user.schema'
import { CreateUserDto, FindUsersQueryDto } from './dto/user.dto'
import { ICreateUserResponse, IFindUserResponse } from './interface/user.interface'
import config from 'src/config'
import { ID } from 'src/common/types/types'

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /** Создание пользователя */
  async create(dto: CreateUserDto): Promise<ICreateUserResponse> {
    try {
      const user = new this.userModel({
        email: dto.email,
        passwordHash: await this.hashPassword(dto.password),
        name: dto.name,
        contactPhone: dto.contactPhone,
        role: dto.role
      })
      await user.save()

      return {
        id: user._id.toString(),
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

  /** Получение списка пользователей */
  async findAll(dto: FindUsersQueryDto): Promise<IFindUserResponse[]> {
    const query = this.userModel.find()

    if (dto.name) {
      query.where('name').regex(new RegExp(dto.name, 'i'))
    }
    if (dto.email) {
      query.where('email').regex(new RegExp(dto.email, 'i'))
    }
    if (dto.contactPhone) {
      query.where('contactPhone').regex(new RegExp(dto.contactPhone, 'i'))
    }

    const users = await query
      .limit(dto.limit)
      .skip(dto.offset)
      .exec()

    return users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    }))
  }

  /** Получение пользователя по id */
  async findById(id: ID): Promise<UserDocument> {
    return await this.userModel.findById(id)
  }

  /** Получение пользователя по email */
  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email })
  }

  /** Хеширование пароля */
  async hashPassword(password: string) {
    return await bcrypt.hash(password, config.auth.saltRounds)
  }
}