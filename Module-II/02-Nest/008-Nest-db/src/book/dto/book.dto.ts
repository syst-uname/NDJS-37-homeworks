import { Book } from '../schemas/book.schema'

export class CreateBookDto {
  title: Book['title']
  authors: Book['authors']
  description: Book['description']
}

export class UpdateBookDto {
  description: Book['description']
}
