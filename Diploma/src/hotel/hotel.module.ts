import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { HotelController } from './hotel.controller'
import { HotelService } from './hotel.service'
import { Hotel, HotelRoom, HotelRoomSchema, HotelSchema } from './schemas'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [HotelService],
})
export class HotelModule {}
