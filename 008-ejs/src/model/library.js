import Book from './book.js'
import { book1, book2, book3 } from './books.mock.js'

class Library {
  constructor() {
    this.books = []

    // тестовые данные
    this.books.push(book1)
    this.books.push(book2)
    this.books.push(book3)
  }

  add(data, files) {
    const book = new Book({
      id: this.nextId(),
      ...data,
      fileOriginalCover: files.fileCover[0].originalname,
      fileNameCover: files.fileCover[0].filename,
      fileOriginalBook: files.fileBook[0].originalname,
      fileNameBook: files.fileBook[0].filename
    })
    if (book) {
      this.books.push(book)
      return book
    }
  }

  get(id) {
    return this.books.find(book => book.id === +id)
  }

  getAll() {
    return this.books
  }

  update(id, data, files) {
    const fileData = {}

    if (files.fileCover) {
      fileData.fileOriginalCover = files.fileCover[0].originalname
      fileData.fileNameCover = files.fileCover[0].filename
    }

    if (files.fileBook) {
      fileData.fileOriginalBook = files.fileBook[0].originalname
      fileData.fileNameBook = files.fileBook[0].filename
    }

    const index = this.books.findIndex(book => book.id === +id)
    if (index !== -1) {
      this.books[index] = {
        ...this.books[index],
        ...data,
        ...fileData
      }
      return this.books[index]
    }
  }

  delete(id) {
    const index = this.books.findIndex(book => book.id === +id)
    if (index !== -1) {
      this.books.splice(index, 1)
      return true
    }
  }

  nextId() {
    return this.books.length === 0 ? 1 : this.books[this.books.length - 1].id + 1
  }
}

export default new Library()