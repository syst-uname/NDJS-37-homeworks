import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Hotel } from './hotel.schema'

export type HotelRoomDocument = HotelRoom & Document

@Schema()
export class HotelRoom {
  @Prop({ type: Types.ObjectId, ref: 'Hotel', required: true,  })
    hotel: Hotel

  @Prop({ type: String })
    description: string

  @Prop({ type: [String], default: [] })
    images: string[]

  @Prop({ type: Date, required: true })
    createdAt: Date

  @Prop({ type: Date, required: true })
    updatedAt: Date

  @Prop({ type: Boolean, required: true, default: true })
    isEnabled: boolean
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom)