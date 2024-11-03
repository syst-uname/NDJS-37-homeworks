import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

import { AppModule } from '../../app.module'
import { BookService } from '../book.service'
import { CreateBookDto, UpdateBookDto } from '../dto/book.dto'

describe('BookController (e2e)', () => {
  let app: INestApplication
  const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(BookService)
      .useValue(mockBookService)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('create', () => {
    it('POST /book - should create a new book', async () => {
      const mockBookDto: CreateBookDto = {
        title: 'Mock Title',
        authors: 'Mock Authors',
        description: 'Mock Description'
      }
      const mockCreatedBook = { id: 1, ...mockBookDto }
      mockBookService.create.mockResolvedValue(mockCreatedBook)

      const response = await request(app.getHttpServer())
        .post('/book')
        .send(mockBookDto)
        .expect(201)

      expect(response.body).toEqual(mockCreatedBook)
      expect(mockBookService.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('findAll', () => {
    it('GET /book - should return all books', async () => {
      const mockBooks = ['book1', 'book2']
      mockBookService.findAll.mockResolvedValue(mockBooks)

      const response = await request(app.getHttpServer())
        .get('/book')
        .expect(200)

      expect(response.body).toEqual(mockBooks)
      expect(mockBookService.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('findOne', () => {
    it('GET /book/:id - should return one book', async () => {
      const mockBookId = 'bookId'
      const mockBook = ['book']
      mockBookService.findOne.mockResolvedValue(mockBook)

      const response = await request(app.getHttpServer())
        .get('/book/' + mockBookId)
        .expect(200)

      expect(response.body).toEqual(mockBook)
      expect(mockBookService.findOne).toHaveBeenCalledWith(mockBookId)
    })
  })

  describe('update', () => {
    it('PUT /book/:id - should update a book', async () => {
      const mockBookId = 'bookId'
      const mockBookDto: UpdateBookDto = { description: 'updated book' }
      const mockUpdatedBook = { id: mockBookId, ...mockBookDto }
      mockBookService.update.mockResolvedValue(mockUpdatedBook)

      const response = await request(app.getHttpServer())
        .put('/book/' + mockBookId)
        .send(mockBookDto)
        .expect(200)

      expect(response.body).toEqual(mockUpdatedBook)
      expect(mockBookService.update).toHaveBeenCalledWith(mockBookId, mockBookDto)
    })
  })

  describe('remove', () => {
    it('DELETE /book/:id - should remove a book', async () => {
      const mockBookId = 'bookId'
      const mockBook = ['book']
      mockBookService.remove.mockResolvedValue(mockBook)

      const response = await request(app.getHttpServer())
        .delete('/book/' + mockBookId)
        .expect(200)

      expect(response.body).toEqual(mockBook)
      expect(mockBookService.remove).toHaveBeenCalledWith(mockBookId)
    })
  })

})