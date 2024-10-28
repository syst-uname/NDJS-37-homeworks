### Аутентификация в NestJS, Passport.js, Guards
  
#### Доступ к защищенным данным без аутентификации 

Запрос `GET` на `http://localhost:3000/api/v1`  
Ответ:
```
{
    "message": "Необходима аутентификация",
    "error": "Unauthorized",
    "statusCode": 401
}
```


#### Регистрация пользователя

Запрос `POST` на `http://localhost:3000/api/v1/user/signup`  
Тело запроса:
```
{
    "email": "u1@mail.ru",
    "password": "p1",
    "firstName": "Имя1",
    "lastName": "Фамилия1"
}
```

Ответ:
```
{
    "email": "u1@mail.ru",
    "password": "p1",
    "firstName": "Имя1",
    "lastName": "Фамилия1",
    "_id": "671ff2107894091b4592cdce",
    "__v": 0
}
```

#### Аутентификация пользователя 

Запрос `POST` на `http://localhost:3000/api/v1/user/signin`  
Тело запроса:
```
{
    "email": "u1@mail.ru",
    "password": "p1"
}
```

Ответ:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWZmMjEwNzg5NDA5MWI0NTkyY2RjZSIsImVtYWlsIjoidTFAbWFpbC5ydSIsImZpcnN0TmFtZSI6ItCY0LzRjzEiLCJpYXQiOjE3MzAxNDY5ODQsImV4cCI6MTczMDE0NzA0NH0.-g1jt_vNPZ6eHsl8UBh2EyQ5EaTX3TySJFPYP_1RMCs"
}
```

#### Доступ к защищенным данным с использованием jwt токена 

Запрос `GET` на `http://localhost:3000/api/v1` с указанием в заголовке Bearer Token из предыдущего пункта:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWZmMjEwNzg5NDA5MWI0NTkyY2RjZSIsImVtYWlsIjoidTFAbWFpbC5ydSIsImZpcnN0TmFtZSI6ItCY0LzRjzEiLCJpYXQiOjE3MzAxNDY5ODQsImV4cCI6MTczMDE0NzA0NH0.-g1jt_vNPZ6eHsl8UBh2EyQ5EaTX3TySJFPYP_1RMCs
```

Ответ:
```
{
    "title": "Аутентификация в NestJS, Passport.js, Guards",
    "data": "Закрытые данные"
}
```

#### Доступ к защищенным данным с использованием просроченного jwt токена 

Запрос `GET` на `http://localhost:3000/api/v1` с указанием в заголовке Bearer Token из предыдущего пункта, но по прошествии 1 минуты.
Ответ: 
```
{
    "message": "Необходима аутентификация",
    "error": "Unauthorized",
    "statusCode": 401
}
```

