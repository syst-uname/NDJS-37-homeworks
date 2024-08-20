### Тестирование паттерна "цепочка обязанностей"
 
##### Создание книги (с файлом)
Запрос `POST` к `http://localhost:3000/api/books`  
Содержимое `body` запроса в формате `form-data`:

Key           | Type | Value
------------- | ---- | --------
title         | Text | Война и мир
authors       | Text | Л. Н. Толстой
description   | Text | Роман-эпопея
favorite      | Text | 1000
fileCover     | Text | img1.jpg
fileName      | Text | Война и мир.jpg
fileBook      | File | Война и мир.jpg [прикрепленный в Postman файл в виде картинки]
  
Результат:  
```
{
    "id": 1,
    "title": "Война и мир",
    "authors": "Л. Н. Толстой",
    "description": "Роман-эпопея",
    "favorite": "1000",
    "fileCover": "img1.jpg",
    "fileName": "Война и мир.jpg",
    "fileBook": "uploads\\Л. Н. Толстой - Война и мир.jpg"
}
```  
В теле `body` запроса в атрибуте `fileBook` прикрепляеся сам файл книги.  
В ответе с сервера в поле `fileBook` возвращается путь к файлу, где он был сохранен на сервере. 


##### Скачивание файла книги 
Запрос `GET` к `http://localhost:3000/api/books/1/download`  
Результат: Postman в `Body` возвращает файл книги в виде картинки.  
Состав `Headers`:  
Key                  | Value
-------------------- | --------
X-Powered-By         | Express
Content-Disposition  | attachment; filename="????? ? ???.jpg"; filename*=UTF-8''%D0%92%D0%BE%D0%B9%D0%BD%D0%B0%20%D0%B8%20%D0%BC%D0%B8%D1%80.jpg
Accept-Ranges        | bytes
Cache-Control        | public, max-age=0 
Last-Modified        | Tue, 16 Jul 2024 18:20:39 GMT
ETag                 | W/"2f190-190baa11e0b"
Content-Type         | image/jpeg
Content-Length       | 192912 
Date                 | Tue, 16 Jul 2024 18:21:03 GMT
Connection           | keep-alive
Keep-Alive           | timeout=5

Видно, что в `Content-Disposition` название файла возвращается в неверной кодировке как `????? ? ???.jpg`. Не уверен, что это является ошибкой, т.к. если сделать обращение на `http://localhost:3000/api/books/1/download` не через Postman, а в браузере, то открывается диалог сохранения файла с корректным именем.  