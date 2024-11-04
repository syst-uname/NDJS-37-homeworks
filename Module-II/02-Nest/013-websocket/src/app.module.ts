import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BookCommentModule } from './bookComment/bookComment.module'
import { BookCommentGateway } from './bookComment/bookComment.gateway'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
    BookCommentModule
  ],
  controllers: [AppController],
  providers: [AppService, BookCommentGateway],
})
export class AppModule {}
