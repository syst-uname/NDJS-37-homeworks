import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { HotelDocument } from './hotel.schema'

export type HotelRoomDocument = HotelRoom & Document

@Schema({ timestamps: true })
export class HotelRoom {
  @Prop({ type: Types.ObjectId, ref: 'Hotel', required: true,  })
    hotel: HotelDocument

  @Prop({ type: String })
    description: string

  @Prop({ type: [String], default: [] })
    images: string[]

  @Prop({ type: Boolean, required: true, default: true })
    isEnabled: boolean
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom)