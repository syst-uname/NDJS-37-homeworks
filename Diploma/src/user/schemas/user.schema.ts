import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ROLE } from '../constants'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true })
    email: string

  @Prop({ type: String, required: true })
    passwordHash: string

  @Prop({ type: String, required: true })
    name: string

  @Prop({type: String})
    contactPhone: string

  @Prop({ type: String, required: true, default: ROLE.CLIENT })
    role: ROLE
}

export const UserSchema = SchemaFactory.createForClass(User)