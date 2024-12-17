import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

import { User, UserDocument } from '@src/user/schemas'
import { MessageDocument } from './message.schema'

export type SupportRequestDocument = SupportRequest & Document

@Schema()
export class SupportRequest {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true,  })
    user: UserDocument

  @Prop({ type: Date, required: true })
    createdAt: Date

  @Prop({ type: [Types.ObjectId], ref: User.name, required: true,  })
    messages: [MessageDocument]

  @Prop({ type: Boolean })
    isActive: boolean
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest)