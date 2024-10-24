import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ParseIntPipe, UseInterceptors } from '@nestjs/common'
import { BookService } from './book.service'
import { CreateBookDto, UpdateBookDto } from './dto/book.dto'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { BookValidationPipe } from 'src/pipes/book.validation.pipe'
import { ResponseInterceptor } from 'src/interceptors/response.interceptor'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UsePipes(new BookValidationPipe())
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto)
  }

  @Get()
  findAll() {
    return this.bookService.findAll()
  }

  @UseInterceptors(new ResponseInterceptor())
  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: number) {
    return this.bookService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto
  ) {
    return this.bookService.update(id, updateBookDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id)
  }
}
