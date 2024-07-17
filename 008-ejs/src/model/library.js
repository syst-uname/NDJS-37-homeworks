import Book from './book.js'

class Library {
  constructor() {
    this.books = []
  }

  add(data, file) {
    const book = new Book({
      id: this.nextId(),
      ...data,
      fileBook: file.path
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

  update(id, data) {
    const index = this.books.findIndex(book => book.id === +id)
    if (index !== -1) {
      this.books[index] = {
        ...this.books[index],
        ...data
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