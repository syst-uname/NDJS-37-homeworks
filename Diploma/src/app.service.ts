import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello() {
    return  'Дипломный проект на курсе «Backend-разработка на Node.js»'
  }
}
