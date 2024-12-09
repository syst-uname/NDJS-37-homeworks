import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

import config from '@src/config'
import { User, UserDocument } from './schemas'
import { CreateUserDto } from './dto'
import { IFindUsersParams } from './types'
import { ID } from '@src/common/types'

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /** Создание пользователя */
  async create(dto: CreateUserDto): Promise<UserDocument> {
    try {
      if (await this.userModel.findOne({ email: dto.email })) {
        throw new ConflictException('Email уже занят')
      }
      const user = new this.userModel({
        email: dto.email,
        passwordHash: await this.hashPassword(dto.password),
        name: dto.name,
        contactPhone: dto.contactPhone,
        role: dto.role
      })
      return await user.save()
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e
      }
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при создании пользователя: ${e.message}`)
    }
  }

  /** Получение списка пользователей */
  async findAll(params: IFindUsersParams): Promise<UserDocument[]> {
    const query = this.userModel.find()

    if (params.name) {
      query.where('name').regex(new RegExp(params.name, 'i'))
    }
    if (params.email) {
      query.where('email').regex(new RegExp(params.email, 'i'))
    }
    if (params.contactPhone) {
      query.where('contactPhone').regex(new RegExp(params.contactPhone, 'i'))
    }

    return await query
      .limit(params.limit)
      .skip(params.offset)
      .exec()
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