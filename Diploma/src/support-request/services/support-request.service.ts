import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { SupportRequest, SupportRequestDocument } from '../schemas'

@Injectable()
export class SupportRequestService {
  constructor(@InjectModel(SupportRequest.name) protected supportRequestModel: Model<SupportRequestDocument>) {}
}
