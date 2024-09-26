import container from '../config/container.js'
import CustomError from '../errors/custom.error.js'
import BookModel from '../models/book.model.js'
import { CounterRepository } from './index.js'

class BookRepository {

    async add(data, files) {
        try {
            const book = new BookModel({
                id: await this.nextId(),
                ...data,
                fileOriginalCover: files.fileCover[0].originalname,
                fileNameCover: files.fileCover[0].filename,
                fileOriginalBook: files.fileBook[0].originalname,
                fileNameBook: files.fileBook[0].filename
            })
            const newBook = await book.save()
            return newBook
        } catch (error) {
            throw new CustomError(`Ошибка при добавлении книги: ${error.message}`, 500)
        }
    }

    async get(id) {
        try {
            const book = await BookModel.findOne({ id }).lean()
            if (book) {
                const counterRepository = container.get(CounterRepository)
                book.views = await counterRepository.get(+id)       // получение количества просмотров
                return book
            } else {
                throw new Error(`Книга ${id} не найдена`)
            }
        } catch (error) {
            throw new CustomError(`Ошибка при получении книги ${id}: ${error.message}`, 404)
        }
    }

    async getAll() {
        try {
            const books = await BookModel.find()
            return books
        } catch (error) {
            throw new CustomError(`Ошибка при получении книг: ${error.message}`, 500)
        }
    }

    async update(id, data, files) {
        try {
            const fileData = {}
            if (files.fileCover) {
                fileData.fileOriginalCover = files.fileCover[0].originalname
                fileData.fileNameCover = files.fileCover[0].filename
            }
            if (files.fileBook) {
                fileData.fileOriginalBook = files.fileBook[0].originalname
                fileData.fileNameBook = files.fileBook[0].filename
            }

            const result = await BookModel.updateOne(
                { id },
                {
                    ...data,
                    ...fileData
                }
            )
            return result.modifiedCount === 1
        } catch (error) {
            throw new CustomError(`Ошибка при обновлении книги ${id}: ${error.message}`, 500)
        }
    }

    async delete(id) {
        try {
            const result = await BookModel.deleteOne({ id })
            return result.deletedCount === 1
        } catch (error) {
            throw new CustomError(`Ошибка при удалении книги ${id}: ${error.message}`, 500)
        }
    }

    // следующий id книги
    async nextId() {
        const lastBook = await BookModel.findOne().sort({ id: -1 }).limit(1)
        return lastBook ? lastBook.id + 1 : 1
    }

    // всего книг 
    async count() {
        try {
            return await BookModel.countDocuments()
        } catch (error) {
            return 0
        }
    }

    // контент для главной страницы
    async titleContent() {
        return {
            new: await this.randomBooks(2),
            popular: await this.randomBooks(2),
            specially: await this.randomBooks(1),
        }
    }

    // произвольный набор книг для главного экрана 
    async randomBooks(count) {
        const books = await this.getAll()
        if (books.length < count)
            return books

        const result = []
        while (result.length < count) {
            const index = Math.floor(Math.random() * books.length)
            const [book] = books.splice(index, 1)
            result.push(book)
        }
        return result
    }
}

export default BookRepository