import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BookComment, BookCommentDocument } from './schemas/bookComment.schema'
import { CreateBookCommentDto, UpdateBookCommentDto } from './dto/bookComment.dto'
import { Model } from 'mongoose'

@Injectable()
export class BookCommentService {

  constructor(
    @InjectModel(BookComment.name) private BookCommentModel: Model<BookCommentDocument>,
  ) {}

  create(data: CreateBookCommentDto): Promise<BookCommentDocument> {
    return this.BookCommentModel.create(data)
  }

  findOne(id: string): Promise<BookCommentDocument> {
    return this.BookCommentModel.findById(id)
  }

  findAll(): Promise<BookCommentDocument[]> {
    return this.BookCommentModel.find()
  }

  findAllBookComment(bookId: number): Promise<BookCommentDocument[]> {
    return this.BookCommentModel.find({ bookId })
  }

  update(id: string, data: UpdateBookCommentDto): Promise<BookCommentDocument> {
    return this.BookCommentModel.findByIdAndUpdate(id, data)
  }

  remove(id: string) {
    return this.BookCommentModel.findByIdAndDelete(id)
  }
}
