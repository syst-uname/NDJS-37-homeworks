import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { BookComment, BookCommentSchema } from './schemas/bookComment.schema'
import { BookCommentController } from './bookComment.controller'
import { BookCommentService } from './bookComment.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BookComment.name, schema: BookCommentSchema }])
  ],
  controllers: [BookCommentController],
  providers: [BookCommentService],
  exports: [BookCommentService],
})
export class BookCommentModule {}
