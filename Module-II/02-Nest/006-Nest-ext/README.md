### Погружение в Nest.js

#### Реализация 
Создан новый проект `006-Nest-ext` через Nest CLI.  
Созданы сервис `BooksService`, контроллер `BooksController` и модуль `BooksModule`. 

#### Тестирование 

##### Создание книг 

Запрос `POST` на `http://localhost:3000/books`
Тело запроса:
```
{ 
    "id": 1,
    "title": "Книга 1",
    "authors": "Автор 1",
    "description": "Описание 1"
}
```

Аналогичный второй запрос `POST` на `http://localhost:3000/books`
Тело запроса:
```
{ 
    "id": 2,
    "title": "Книга 2",
    "authors": "Автор 2",
    "description": "Описание 2"
}
```

##### Список всех книг 

Запрос `GET` на `http://localhost:3000/books` 


Результат:
```
[
    {
        "id": 1,
        "title": "Книга 1",
        "authors": "Автор 1",
        "description": "Описание 1"
    },
    {
        "id": 2,
        "title": "Книга 2",
        "authors": "Автор 2",
        "description": "Описание 2"
    }
]
```

##### Конкретная книга  

Запрос `GET` на `http://localhost:3000/books/2` 

Результат:
```
{
    "id": 2,
    "title": "Книга 2",
    "authors": "Автор 2",
    "description": "Описание 2"
}
```


##### Изменение книги 

Запрос `PATCH` на `http://localhost:3000/books/2` 
Тело запроса:
```
{ 
    "description": "Новое описание книги"
}
```


Результат:
```
{
    "id": 2,
    "title": "Книга 2",
    "authors": "Автор 2",
    "description": "Новое описание книги"
}
```

##### Удаление книги

Запрос `DELETE` на `http://localhost:3000/books/1` 

Результат:
```
Книга с id 1 удалена
```

Повторный запрос `DELETE` на `http://localhost:3000/books/1` 

Результат:
```
Книги с id 1 не существует
```

##### Список всех книг после удаления 

Запрос `GET` на `http://localhost:3000/books` 

Результат:
```
[
    {
        "id": 2,
        "title": "Книга 2",
        "authors": "Автор 2",
        "description": "Новое описание книги"
    }
]
```  