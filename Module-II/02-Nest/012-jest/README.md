### Тестирование. Библиотека Jest

##### unit-тесты 

В файле `/src/book/test/book.service.spec.ts` описаны основные unit-тесты на все методы `BooksService`.


##### e2e-тесты  

В файле `/src/book/test/book.e2e.spec.ts` описаны основные e2e-тесты на методы `BooksController`.


##### Результат проверки 

Результат теста после запуска `npm run test`: 

```
> 012-jest@0.0.1 test
> jest

 PASS  src/app.controller.spec.ts
 PASS  src/book/test/book.service.spec.ts
 PASS  src/book/test/book.e2e.spec.ts

Test Suites: 3 passed, 3 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        3.454 s, estimated 4 s
Ran all test suites.
```

##### Результат проверки при наличии ошибки 

Допустим, в методе `findAll` сервиса `BookService` по ошибке больше не вызывается метод `BookModel.find()`:
```
  findAll(): Promise<BookDocument[]> {
    // return this.BookModel.find()
    return Promise.resolve([])
  }
```

Тогда результат тестирования будет следующим: 
```
> 012-jest@0.0.1 test
> jest

 PASS  src/app.controller.spec.ts
 FAIL  src/book/test/book.service.spec.ts
  ● BookService › findAll › should return an array of all books

    expect(received).toEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 1

    - Array [
    -   Object {
    -     "title": "exist book",
    -   },
    - ]
    + Array []

      55 |
      56 |       const result = await bookService.findAll()
    > 57 |       expect(result).toEqual(mockBooks)
         |                      ^
      58 |       expect(mockBookModel.find).toHaveBeenCalled()
      59 |     })
      60 |   })

      at Object.<anonymous> (book/test/book.service.spec.ts:57:22)

 PASS  src/book/test/book.e2e.spec.ts

Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 7 passed, 8 total
Snapshots:   0 total
Time:        3.028 s, estimated 4 s
Ran all test suites.
```


