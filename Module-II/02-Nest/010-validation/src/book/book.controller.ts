import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { BookService } from './book.service'
import { CreateBookDto, UpdateBookDto } from './dto/book.dto'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto)
  }

  @Get()
  findAll() {
    return this.bookService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.bookService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto
  ) {
    return this.bookService.update(+id, updateBookDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id)
  }
}
