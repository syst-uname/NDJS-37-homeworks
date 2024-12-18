import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { ISupportRequestService } from '../interfaces'
import { SupportRequest, SupportRequestDocument } from '../schemas'
import { GetChatListParams } from '../dto'

@Injectable()
export class SupportRequestService implements ISupportRequestService {

  constructor(@InjectModel(SupportRequest.name) protected supportRequestModel: Model<SupportRequestDocument>) {}

  /** Получение списка обращений в поддержку  */
  async findSupportRequests(data: GetChatListParams): Promise<SupportRequestDocument[]> {
    try {
      const query = this.supportRequestModel.find()
      if (data.user) {
        query.where('user').equals(data.user)
      }
      if (data.isActive !== undefined) {
        query.where('isActive').equals(data.isActive)
      }
      return await query
        .limit(data.limit)
        .skip(data.offset)
        .populate('user')
        .exec()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при получение списка обращений: ${e.message}`)
    }
  }

}
