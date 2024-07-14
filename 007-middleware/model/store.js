import Book from './book.js'

const data1 = {
  title: 'Война и мир',
  authors: 'Лев Николайевич Толстой',
  description: 'Роман-эпопея',
  favorite: 1000,
  fileCover: 'img1.jpg',
  fileName: 'Война и мир.txt'
}

const data2 = {
  title: 'JavaScript для чайников',
  authors: 'Крис Минник и Ева Холланд',
  description: 'Руководство разработчикам-новичкам',
  favorite: 2000,
  fileCover: 'img2.jpg',
  fileName: 'JavaScript для чайников.pdf'
}

class Store {
  constructor() {
    this.books = []

    this.add(data1)
    this.add(data2)
  }

  add(data) {
    const book = new Book({
      id: this.nextId(),
      ...data
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

export default new Store()