import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type HotelDocument = Hotel & Document

@Schema({ timestamps: true })
export class Hotel {
  @Prop({ type: String, required: true, unique: true })
    title: string

  @Prop({ type: String })
    description?: string
}

export const HotelSchema = SchemaFactory.createForClass(Hotel)