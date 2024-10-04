import { IBook } from './book.interface'

export interface UpdateBookDto {
  title: IBook['title']
  authors: IBook['authors']
  description: IBook['description']
  favorite: IBook['favorite']
}

export type CreateBookFilesDto = { [key: string]: Express.Multer.File[] };

export interface BookDto extends IBook {
  views: number
}

export interface LibraryContentDto {
  new: IBook[]
  popular: IBook[]
  specially: IBook[]
}
