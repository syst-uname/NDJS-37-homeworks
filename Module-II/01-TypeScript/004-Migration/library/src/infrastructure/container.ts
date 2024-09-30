import 'reflect-metadata'
import { Container, decorate, injectable } from 'inversify'

import { BookService, CommentService, CounterService, UserService } from '../services'

export const container = new Container()

decorate(injectable(), BookService)
decorate(injectable(), CommentService)
decorate(injectable(), CounterService)
decorate(injectable(), UserService)

container.bind(BookService).toSelf()
container.bind(CommentService).toSelf()
container.bind(CounterService).toSelf()
container.bind(UserService).toSelf()