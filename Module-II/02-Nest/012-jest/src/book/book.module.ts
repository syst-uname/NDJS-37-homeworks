import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Book, BookSchema } from './schemas/book.schema'
import { BookController } from './book.controller'
import { BookService } from './book.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }])
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
