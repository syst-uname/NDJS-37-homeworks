import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import config from './config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { HotelModule } from './hotel/hotel.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(config.mongo.connection),
    AuthModule,
    UserModule,
    HotelModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
