### Тестирование API CRUD для работы с сущностью «книга»
 
##### 1. Авторизация пользователя 
Запрос `POST` к `http://localhost:3000/api/user/login`  
Результат:  
```
{
    "id": 1,
    "mail": "test@mail.ru"
}
```
  
##### 2.1. Получить все книги
Запрос `GET` к `http://localhost:3000/api/books`  
Результат:  
```
[
    {
        "id": 1,
        "title": "Война и мир",
        "authors": "Лев Николайевич Толстой",
        "description": "Роман-эпопея",
        "favorite": 1000,
        "fileCover": "img1.jpg",
        "fileName": "Война и мир.txt"
    },
    {
        "id": 2,
        "title": "JavaScript для чайников",
        "authors": "Крис Минник и Ева Холланд",
        "description": "Руководство разработчикам-новичкам",
        "favorite": 2000,
        "fileCover": "img2.jpg",
        "fileName": "JavaScript для чайников.pdf"
    }
]
```
  
##### 2.2. Получить книгу по ID (книга сущесвует) 
Запрос `GET` к `http://localhost:3000/api/books/2`  
Результат:  
```
{
    "id": 2,
    "title": "JavaScript для чайников",
    "authors": "Крис Минник и Ева Холланд",
    "description": "Руководство разработчикам-новичкам",
    "favorite": 2000,
    "fileCover": "img2.jpg",
    "fileName": "JavaScript для чайников.pdf"
}
```  

##### 2.3. Получить книгу по ID (книга не сущесвует) 
Запрос `GET` к `http://localhost:3000/api/books/123`  
Результат:  
```
"Книга 123 не найдена"
```

##### 3.1. Создать книгу
Запрос `POST` к `http://localhost:3000/api/books`  
Содержимое `body` запроса:
```
{ 
    "title": "Туда и обратно",
    "authors": "Джон Р. Р. Толкин",
    "description": "Путешествие хоббита Бильбо Бэггинса",
    "favorite": 3000,
    "fileCover": "Hobbit.jpg",
    "fileName": "There and Back Again.fb2"
}
```
Результат:  
```
{
    "id": 3,
    "title": "Туда и обратно",
    "authors": "Джон Р. Р. Толкин",
    "description": "Путешествие хоббита Бильбо Бэггинса",
    "favorite": 3000,
    "fileCover": "Hobbit.jpg",
    "fileName": "There and Back Again.fb2"
}
```  

##### 3.2. Список всех книги (после создания)
Запрос `GET` к `http://localhost:3000/api/books`  
Результат:  
```
[
    {
        "id": 1,
        "title": "Война и мир",
        "authors": "Лев Николайевич Толстой",
        "description": "Роман-эпопея",
        "favorite": 1000,
        "fileCover": "img1.jpg",
        "fileName": "Война и мир.txt"
    },
    {
        "id": 2,
        "title": "JavaScript для чайников",
        "authors": "Крис Минник и Ева Холланд",
        "description": "Руководство разработчикам-новичкам",
        "favorite": 2000,
        "fileCover": "img2.jpg",
        "fileName": "JavaScript для чайников.pdf"
    },
    {
        "id": 3,
        "title": "Туда и обратно",
        "authors": "Джон Р. Р. Толкин",
        "description": "Путешествие хоббита Бильбо Бэггинса",
        "favorite": 3000,
        "fileCover": "Hobbit.jpg",
        "fileName": "There and Back Again.fb2"
    }
]
```
  
##### 4.1. Редактировать книгу по ID (книга сущесвует) 
Запрос `PUT` к `http://localhost:3000/api/books/1`  
Содержимое `body` запроса:
```
{  
    "description": "Новое описание романа",
    "favorite": 4000
}
```
Результат:  
```
{
    "id": 1,
    "title": "Война и мир",
    "authors": "Лев Николайевич Толстой",
    "description": "Новое описание романа",
    "favorite": 4000,
    "fileCover": "img1.jpg",
    "fileName": "Война и мир.txt"
}
``` 

##### 4.2. Редактировать книгу по ID (книга не сущесвует)
Запрос `PUT` к `http://localhost:3000/api/books/33`  
Содержимое `body` запроса:
```
{  
    "description": "Новое описание"
}
```
Результат:  
```
"Книга 33 не создана"
``` 

##### 4.3. Список всех книги (после изменения)
Запрос `GET` к `http://localhost:3000/api/books`  
Результат:  
```
[
    {
        "id": 1,
        "title": "Война и мир",
        "authors": "Лев Николайевич Толстой",
        "description": "Новое описание романа",
        "favorite": 4000,
        "fileCover": "img1.jpg",
        "fileName": "Война и мир.txt"
    },
    {
        "id": 2,
        "title": "JavaScript для чайников",
        "authors": "Крис Минник и Ева Холланд",
        "description": "Руководство разработчикам-новичкам",
        "favorite": 2000,
        "fileCover": "img2.jpg",
        "fileName": "JavaScript для чайников.pdf"
    },
    {
        "id": 3,
        "title": "Туда и обратно",
        "authors": "Джон Р. Р. Толкин",
        "description": "Путешествие хоббита Бильбо Бэггинса",
        "favorite": 3000,
        "fileCover": "Hobbit.jpg",
        "fileName": "There and Back Again.fb2"
    }
]
```

##### 5.1. Удалить книгу (книга сущесвует) 
Запрос `DELETE` к `http://localhost:3000/api/books/2`  
Результат:  
```
"Книга 2 удалена"
``` 

##### 5.2. Удалить книгу (книга не сущесвует) 
Запрос `DELETE` к `http://localhost:3000/api/books/222`  
Результат:  
```
"Книга 222 не найдена"
``` 

##### 5.3. Список всех книги (после удаления)
Запрос `GET` к `http://localhost:3000/api/books`  
Результат:  
```
[
    {
        "id": 1,
        "title": "Война и мир",
        "authors": "Лев Николайевич Толстой",
        "description": "Новое описание романа",
        "favorite": 4000,
        "fileCover": "img1.jpg",
        "fileName": "Война и мир.txt"
    },
    {
        "id": 3,
        "title": "Туда и обратно",
        "authors": "Джон Р. Р. Толкин",
        "description": "Путешествие хоббита Бильбо Бэггинса",
        "favorite": 3000,
        "fileCover": "Hobbit.jpg",
        "fileName": "There and Back Again.fb2"
    }
]
```
  