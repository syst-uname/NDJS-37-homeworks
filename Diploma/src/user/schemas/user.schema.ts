import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { USER_ROLE } from '@src/auth/constants'

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

  @Prop({ type: String, enum: USER_ROLE, required: true, default: USER_ROLE.CLIENT })
    role: USER_ROLE
}

export const UserSchema = SchemaFactory.createForClass(User)