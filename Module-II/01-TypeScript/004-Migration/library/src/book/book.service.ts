import { BookModel } from './book.model'
import { IBook } from './book.interface'
import { BookDto, CreateBookFilesDto, UpdateBookDto, LibraryContentDto } from './book.dto'
import { CounterService } from '../counter/counter.service'
import { container } from '../infrastructure'
import { HttpException } from '../exceptions'

export class BookService {

    async create(data: UpdateBookDto, files: CreateBookFilesDto): Promise<IBook> {
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
            throw new HttpException(`Ошибка при добавлении книги: ${error.message}`, 500)
        }
    }

    async get(id: number): Promise<BookDto> {
        try {
            const book = await BookModel.findOne({ id }).lean()
            if (book) {
                const counterService = container.get(CounterService)
                const views = await counterService.get(id)       // получение количества просмотров
                return {
                    ...book,
                    views
                }
            } else {
                throw new Error(`Книга ${id} не найдена`)
            }
        } catch (error) {
            throw new HttpException(`Ошибка при получении книги ${id}: ${error.message}`, 404)
        }
    }

    async getAll(): Promise<IBook[]> {
        try {
            const books = await BookModel.find()
            return books
        } catch (error) {
            throw new HttpException(`Ошибка при получении книг: ${error.message}`, 500)
        }
    }

    async update(id: number, data: UpdateBookDto, files: CreateBookFilesDto): Promise<boolean> {
        try {
            const fileData: Partial<IBook> = {}
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
            throw new HttpException(`Ошибка при обновлении книги ${id}: ${error.message}`, 500)
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const result = await BookModel.deleteOne({ id })
            return result.deletedCount === 1
        } catch (error) {
            throw new HttpException(`Ошибка при удалении книги ${id}: ${error.message}`, 500)
        }
    }

    // следующий id книги
    async nextId(): Promise<number> {
        const lastBook = await BookModel.findOne().sort({ id: -1 }).limit(1)
        return lastBook ? lastBook.id + 1 : 1
    }

    // всего книг 
    async count(): Promise<number> {
        try {
            return await BookModel.countDocuments()
        } catch {
            return 0
        }
    }

    // контент для главной страницы
    async titleContent(): Promise<LibraryContentDto> {
        return {
            new: await this.randomBooks(2),
            popular: await this.randomBooks(2),
            specially: await this.randomBooks(1),
        }
    }

    // произвольный набор книг для главного экрана 
    async randomBooks(count: number): Promise<IBook[]> {
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