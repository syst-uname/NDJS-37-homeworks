import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'

import { BookService } from './book.service'
import { BookDocument } from './schemas/book.schema'
import { CreateBookDto, UpdateBookDto } from './dto/book.dto'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<BookDocument> {
    return this.bookService.create(createBookDto)
  }

  @Get()
  findAll(): Promise<BookDocument[]> {
    return this.bookService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto
  ): Promise<BookDocument> {
    return this.bookService.update(id, updateBookDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<BookDocument> {
    return this.bookService.remove(id)
  }
}
