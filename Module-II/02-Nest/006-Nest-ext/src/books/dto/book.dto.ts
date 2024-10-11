import { IBook } from '../interfaces/book.interface'

export class CreateBookDto {
  id: IBook['id']
  title: IBook['title']
  authors: IBook['authors']
  description: IBook['description']
}

export class UpdateBookDto {
  description: IBook['description']
}
