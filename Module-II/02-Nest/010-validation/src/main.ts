import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { BookExceptionFilter } from './filters/book.exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new BookExceptionFilter)
  await app.listen(3000)
}
bootstrap()
