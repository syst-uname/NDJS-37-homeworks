import { Test, TestingModule } from '@nestjs/testing'
import { BookService } from './book.service'
import { Book } from './schemas/book.schema'
import { getModelToken } from '@nestjs/mongoose'
import { CreateBookDto, UpdateBookDto } from './dto/book.dto'

describe('BookService', () => {
  let bookService: BookService
  const mockBookModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
      ],
    }).compile()

    bookService = module.get<BookService>(BookService)
  })

  it('should be defined', () => {
    expect(bookService).toBeDefined()
  })

  describe('create', () => {
    it('should create a new book', async () => {
      const mockBookDto: CreateBookDto = {
        title: 'Mock Title',
        authors: 'Mock Authors',
        description: 'Mock Description'
      }
      const mockCreatedBook = { id: 1, ...mockBookDto }
      mockBookModel.create.mockResolvedValue(mockCreatedBook)

      const result = await bookService.create(mockBookDto)
      expect(result).toEqual(mockCreatedBook)
      expect(mockBookModel.create).toHaveBeenCalledWith(mockBookDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of all books', async () => {
      const mockBooks = [{ title: 'exist book' }]
      mockBookModel.find.mockResolvedValue(mockBooks)

      const result = await bookService.findAll()
      expect(result).toEqual(mockBooks)
      expect(mockBookModel.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const mockBookId = 'bookId'
      const mockBook = [{ title: 'find book' }]
      mockBookModel.findById.mockResolvedValue(mockBook)

      const result = await bookService.findOne(mockBookId)
      expect(result).toEqual(mockBook)
      expect(mockBookModel.findById).toHaveBeenCalledWith(mockBookId)
    })
  })

  describe('update', () => {
    it('should update a book', async () => {
      const mockBookId = 'bookId'
      const mockBookDto: UpdateBookDto = { description: 'updated book' }
      const mockUpdatedBook = { id: mockBookId, ...mockBookDto }
      mockBookModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedBook)

      const result = await bookService.update(mockBookId, mockBookDto)
      expect(result).toEqual(mockUpdatedBook)
      expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith(mockBookId, mockBookDto)
    })
  })

  describe('remove', () => {
    it('should remove a book', async () => {
      const mockBookId = 'bookId'
      const mockDeletedBook = { id: mockBookId, title: 'deleted book' }
      mockBookModel.findByIdAndDelete.mockResolvedValue(mockDeletedBook)

      const result = await bookService.remove(mockBookId)
      expect(result).toEqual(mockDeletedBook)
      expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith(mockBookId)
    })
  })

})