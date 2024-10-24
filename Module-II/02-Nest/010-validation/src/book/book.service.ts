import { HttpException, Injectable } from '@nestjs/common'
import { IBook } from './interfaces/book.interface'
import { CreateBookDto, UpdateBookDto } from './dto/book.dto'

@Injectable()
export class BookService {

  private readonly books: IBook[] = []

  create(createBookDto: CreateBookDto) {
    this.books.push(createBookDto)
    return createBookDto
  }

  findAll() {
    return this.books
  }

  findOne(id: number) {
    const book = this.books.find(book => book.id === id)
    if (book) {
      return book
    }
    throw new Error(`Книги с id ${id} не существует`)
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    const index = this.books.findIndex(book => book.id === id)
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...updateBookDto }
      return this.books[index]
    } else {
      throw new HttpException(`Книги с id ${id} не существует!`, 404)
    }
  }

  remove(id: number) {
    const index = this.books.findIndex(book => book.id === id)
    if (index !== -1) {
      this.books.splice(index, 1)
      return {
        message: `Книга с id ${id} удалена`
      }
    } else {
      throw new Error(`Книги с id ${id} не существует`)
    }
  }
}
