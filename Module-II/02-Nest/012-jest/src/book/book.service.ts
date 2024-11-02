import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Book, BookDocument } from './schemas/book.schema'
import { CreateBookDto, UpdateBookDto } from './dto/book.dto'
import { Model } from 'mongoose'

@Injectable()
export class BookService {

  constructor(
    @InjectModel(Book.name) private BookModel: Model<BookDocument>,
  ) {}

  create(data: CreateBookDto): Promise<BookDocument> {
    return this.BookModel.create(data)
  }

  findAll(): Promise<BookDocument[]> {
    return this.BookModel.find()
  }

  findOne(id: string): Promise<BookDocument> {
    return this.BookModel.findById(id)
  }

  update(id: string, data: UpdateBookDto): Promise<BookDocument> {
    return this.BookModel.findByIdAndUpdate(id, data)
  }

  remove(id: string) {
    return this.BookModel.findByIdAndDelete(id)
  }
}
