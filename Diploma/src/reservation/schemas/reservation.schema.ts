import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User, UserDocument } from '@src/user/schemas'
import { Hotel, HotelDocument, HotelRoom, HotelRoomDocument } from '@src/hotel/schemas'

export type ReservationDocument = Reservation & Document

@Schema()
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: UserDocument

  @Prop({ type: Types.ObjectId, ref: Hotel.name, required: true,  })
    hotelId: HotelDocument

  @Prop({ type: Types.ObjectId, ref: HotelRoom.name, required: true,  })
    roomId: HotelRoomDocument

  @Prop({ type: Date, required: true })
    dateStart: Date

  @Prop({ type: Date, required: true })
    dateEnd: Date
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation)