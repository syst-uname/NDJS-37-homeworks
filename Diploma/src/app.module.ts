import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'

import config from './config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { HotelModule } from './hotel/hotel.module'
import { ReservationModule } from './reservation/reservation.module'
import { SupportRequestModule } from './support-request/support-request.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(config.mongo.connection),
    ServeStaticModule.forRoot({ rootPath: config.server.publicDir }),
    AuthModule,
    UserModule,
    HotelModule,
    ReservationModule,
    SupportRequestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
