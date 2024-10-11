import { Injectable } from '@nestjs/common'
import { IBook } from './interfaces/book.interface'
import { CreateBookDto, UpdateBookDto } from './dto/book.dto'

@Injectable()
export class BooksService {

  private readonly books: IBook[] = []

  create(createBookDto: CreateBookDto) {
    this.books.push(createBookDto)
    return createBookDto
  }

  findAll() {
    return this.books
  }

  findOne(id: number) {
    return this.books.find(book => book.id === id)
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    const index = this.books.findIndex(book => book.id === id)
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...updateBookDto }
      return this.books[index]
    } else {
      return `Книги с id ${id} не существует`
    }
  }

  remove(id: number) {
    const index = this.books.findIndex(book => book.id === id)
    if (index !== -1) {
      this.books.splice(index, 1)
      return `Книга с id ${id} удалена`
    } else {
      return `Книги с id ${id} не существует`
    }
  }
}
