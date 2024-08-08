import Book from '../models/book.model.js'
import counter from './counter.js'

class Library {

  async add(data, files) {
    const book = new Book({
      id: await this.nextId(),
      ...data,
      fileOriginalCover: files.fileCover[0].originalname,
      fileNameCover: files.fileCover[0].filename,
      fileOriginalBook: files.fileBook[0].originalname,
      fileNameBook: files.fileBook[0].filename
    })
    const newBook = await book.save()
    return newBook
  }

  async get(id) {
    const book = await Book.findOne({ id }).lean()
    if (book) {
      book.views = await counter.get(+id)       // получение количества просмотров
      return book
    } else {
      throw new Error('Книга не найдена')
    }
  }

  async getAll() {
    const books = await Book.find()
    return books
  }

  async update(id, data, files) {
    const fileData = {}

    if (files.fileCover) {
      fileData.fileOriginalCover = files.fileCover[0].originalname
      fileData.fileNameCover = files.fileCover[0].filename
    }

    if (files.fileBook) {
      fileData.fileOriginalBook = files.fileBook[0].originalname
      fileData.fileNameBook = files.fileBook[0].filename
    }

    const result = await Book.updateOne(
      { id },
      {
        ...data,
        ...fileData
      }
    )
    return result.modifiedCount === 1
  }

  async delete(id) {
    const result = await Book.deleteOne({ id })
    return result.deletedCount === 1
  }

  // следующий id книги
  async nextId() {
    const lastBook = await Book.findOne().sort({ id: -1 }).limit(1)
    return lastBook ? lastBook.id + 1 : 1
  }

  // всего книг 
  async count() {
    try {
      return await Book.countDocuments()
    } catch (error) {
      return 0
    }
  }
}

export default new Library()