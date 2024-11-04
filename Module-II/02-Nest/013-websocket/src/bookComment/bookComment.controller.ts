import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'

import { BookCommentService } from './bookComment.service'
import { BookCommentDocument } from './schemas/bookComment.schema'
import { CreateBookCommentDto, UpdateBookCommentDto } from './dto/bookComment.dto'

@Controller('bookComment')
export class BookCommentController {
  constructor(private readonly bookCommentService: BookCommentService) {}

  @Post()
  create(@Body() createBookCommentDto: CreateBookCommentDto): Promise<BookCommentDocument> {
    return this.bookCommentService.create(createBookCommentDto)
  }

  @Get()
  findAll(): Promise<BookCommentDocument[]> {
    return this.bookCommentService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookCommentDocument> {
    return this.bookCommentService.findOne(id)
  }

  @Get('book/:bookId')
  findAllBookComment(@Param('bookId') bookId: number): Promise<BookCommentDocument[]> {
    return this.bookCommentService.findAllBookComment(bookId)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookCommentDto: UpdateBookCommentDto
  ): Promise<BookCommentDocument> {
    return this.bookCommentService.update(id, updateBookCommentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<BookCommentDocument> {
    return this.bookCommentService.remove(id)
  }
}
