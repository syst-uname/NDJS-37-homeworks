import { BookComment } from '../schemas/bookComment.schema'

export class CreateBookCommentDto {
  bookId: BookComment['bookId']
  comment: BookComment['comment']
}

export class UpdateBookCommentDto {
  comment: BookComment['comment']
}
