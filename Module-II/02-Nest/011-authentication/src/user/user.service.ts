import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'

import { User, UserDocument } from './schemas/user.schema'
import { CreateUserDto } from './dto/user.dto'
import { Connection, Model } from 'mongoose'

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  create(data: CreateUserDto): Promise<UserDocument> {
    const user = new this.UserModel(data)
    return user.save()
  }

  findAll(): Promise<UserDocument[]> {
    return this.UserModel.find()
  }

  findOne(id: string): Promise<UserDocument> {
    return this.UserModel.findById(id)
  }
}
