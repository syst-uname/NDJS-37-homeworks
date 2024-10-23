import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Валидация и обработка ошибок. Interceptors, pipes'
  }
}
