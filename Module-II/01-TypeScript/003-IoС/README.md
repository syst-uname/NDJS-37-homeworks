### IoС и DI. Библиотека reflect-metadata

#### Файл container.js 

Все сервисы приложения перенесены в контейнер `./library/src/config/container.js`. В примерах из лекции использовался TS, а предыдущее ДЗ было реализовано на JS, поэтому пришлось поэкспериментировать с декораторами в JS. Не знаю на сколько верным вышел результат.  

```
import "reflect-metadata"
import { Container, decorate, injectable } from 'inversify'
import { BookRepository, CommentRepository, CounterRepository, UserRepository } from '../repositories/index.js'

const container = new Container()

decorate(injectable(), BookRepository)
decorate(injectable(), CommentRepository)
decorate(injectable(), CounterRepository)
decorate(injectable(), UserRepository)

container.bind(BookRepository).toSelf()
container.bind(CommentRepository).toSelf()
container.bind(CounterRepository).toSelf()
container.bind(UserRepository).toSelf()

export default container
```

#### Использование сервисов 

Для использования сервиса теперь необходимо импортировать созданный контейнер из файла `container.js` и получить из него нужный объект по имени класса: 

```
import { BookRepository } from "../../../repositories/index.js"
import container from "../../../config/container.js"

const bookRepository = container.get(BookRepository)
```

Далее используется уже инстанция сервиса полученная из контейнера: 
```
router.get('/:id', async (req, res) => {
  try {
    const book = await bookRepository.get(req.params.id)
    res.status(200).json(book)
  } catch (error) {
    res.status(error.status).json({ error: error.message })
  }
})
```

#### Публикация  

Образы приложений опубликованы на https://hub.docker.com/repository/docker/u0name/003-ioc/general