import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, Types } from 'mongoose'

import { User, UserDocument } from '@src/user/schemas'

export type MessageDocument = Message & Document

@Schema()
export class Message {

  @Prop({ type: Types.ObjectId, ref: User.name, required: true,  })
    author: UserDocument | ObjectId

  @Prop({ type: Date, required: true })
    sentAt: Date

  @Prop({ type: String, required: true })
    text: string

  @Prop({ type: Date })
    readAt?: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)