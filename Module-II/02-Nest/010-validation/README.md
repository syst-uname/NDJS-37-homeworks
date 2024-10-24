### Валидация и обработка ошибок. Interceptors, pipes

Скопирован проект из задания `006-nest-ext` с реализацией компонента `Book` 

#### Тестирование.  

С помощью POST-запросов предварительно добавлены некоторые книги.

##### Interceptor

Создан класс `ResponseInterceptor` и подключен локально к запросу `GET` при чтении данных книги. Класс оборачивает результат работы сервиса в специальную структуру.   

Запрос `GET` на `http://localhost:3000/book/1` (книга `1` есть).  
Ответ:
```
{
    "status": "success",
    "data": {
        "id": 1,
        "title": "Книга 1",
        "authors": "Автор 1",
        "description": "Описание 1"
    }
}
```

Запрос `GET` на `http://localhost:3000/book/3` (книги `3` нет).  
Ответ:
```
{
    "status": "fail",
    "data": {
        "message": "Книги с id 3 не существует"
    }
}
```

##### Pipe

Создан класс `IdValidationPipe`, подключен локально для параметра `id` в запросе `GET` при чтении данных книги. Класс проверяет, что параметр `id` должен быть положительным числом.   

Запрос `GET` на `http://localhost:3000/book/abc` (текст `abc` вместо числового id).  
Ответ:
```
{
    "status": "fail",
    "data": {
        "message": "Id abc не является числом"
    }
}
```

Запрос `GET` на `http://localhost:3000/book/-10` (отрицательное число как id).  
Ответ:
```
{
    "status": "fail",
    "data": {
        "message": "Id -10 не может быть отрицательным"
    }
}
```

Запрос `GET` на `http://localhost:3000/book/2` (валидный запрос).  
Ответ:
```
{
    "status": "success",
    "data": {
        "id": 2,
        "title": "Книга 2",
        "authors": "Автор 2",
        "description": "Описание 2"
    }
}
```


##### Class-validator

Создан класс `BookValidationPipe`, подключен локально в запросе `POST` при добавлении книги. Класс проверяет корректность добавляемых данных по описанной схеме `CreateBookDto`.   

Запрос `POST` на `http://localhost:3000/book`.  

Тело запроса (ключ `id` отрицательное число, заголовок `title` слишком длинный, значение поля `authors` слишком короткое): 
```
{ 
    "id": -1,
    "title": "Слишком длинный заголовок",
    "authors": "1",
    "description": "Описание 1"
}
```

Ответ:
```
{
    "timestamp": "2024-10-24T20:41:35.834Z",
    "status": "fail",
    "data": {
        "message": "Validation failed: id - id must be a positive number, title - title must be shorter than or equal to 15 characters, authors - authors must be longer than or equal to 3 characters"
    },
    "code": 400
}
```

##### Exception Filter

Создан класс `BookExceptionFilter`, подключен глобально и отлавливает исключения вида `HttpException`.   

Запрос `PATCH` на `http://localhost:3000/book/3` (изменение несуществующей книги).  

Тело запроса: 
```
{ 
    "description": "Новое описание книги"
}
```

Ответ:
```
{
    "timestamp": "2024-10-24T20:47:22.158Z",
    "status": "fail",
    "data": {
        "message": "Книги с id 3 не существует!"
    },
    "code": 404
}
```