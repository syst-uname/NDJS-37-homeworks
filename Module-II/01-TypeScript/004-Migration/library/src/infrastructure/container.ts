import 'reflect-metadata'
import { Container, decorate, injectable } from 'inversify'

import { BookRepository, CommentRepository, CounterRepository, UserRepository } from '../repositories'

export const container = new Container()

decorate(injectable(), BookRepository)
decorate(injectable(), CommentRepository)
decorate(injectable(), CounterRepository)
decorate(injectable(), UserRepository)

container.bind(BookRepository).toSelf()
container.bind(CommentRepository).toSelf()
container.bind(CounterRepository).toSelf()
container.bind(UserRepository).toSelf()