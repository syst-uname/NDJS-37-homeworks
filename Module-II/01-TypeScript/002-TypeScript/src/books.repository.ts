import IBook from './book.interface'

// абстрактный репозиторий библиотеки
abstract class BooksRepository {
  abstract createBook(book: IBook): Promise<IBook>
  abstract getBook(id: number): Promise<IBook>
  abstract getBooks(): Promise<IBook[]>
  abstract updateBook(id: number, book: IBook): Promise<IBook>
  abstract deleteBook(id: number): Promise<IBook>
}

export default BooksRepository