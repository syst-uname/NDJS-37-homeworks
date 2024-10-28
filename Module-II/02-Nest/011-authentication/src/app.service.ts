import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getData() {
    return {
      title: 'Аутентификация в NestJS, Passport.js, Guards',
      data: 'Закрытые данные'
    }
  }
}
