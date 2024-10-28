import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'

import { User, UserDocument } from './schemas/user.schema'
import { Connection, Model } from 'mongoose'
import { SignupDto } from 'src/auth/dto/auth.dto'

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(data: SignupDto): Promise<UserDocument> {
    const user = new this.UserModel(data)
    return user.save()
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return await this.UserModel.findOne({ email })
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email)
    return user && (user.password === password )      // todo bcrypt 
  }
}
