# Дипломный проект на курсе «Backend-разработка на Node.js»

## 1. Запуск 
В корне проекта расположен файл `docker-compose.yml` с сервисом приложения и MondoDB: 

```
services:

  storage_mongo:
    image: mongo 
    ports:
      - 27017:27017
    environment:
      MONGO_INITDB_DATABASE: ostrovok
    volumes:
      - ./src/config/mongo-initdb.js:/docker-entrypoint-initdb.d/mongo-initdb.js:ro 

  ostrovok:
    build: .
    ports: 
      - 80:${PORT}
    environment: 
      - MONGO_URL=mongodb://storage_mongo:27017/ostrovok
    env_file:
      - .env
    depends_on: 
      - storage_mongo 
```

Для инициализации данных БД в сервисе `storage_mongo` указан файл `mongo-initdb.js`. С помощью этого скрипта для последующей работы с пользователями в коллекции `users` создается пользователь `admin` с соответствующей ролью и паролем `admin` (после прочтения сжечь).
Сервис `ostrovok` формируется с помощью соответствующего `Dockerfile` в корне проекта. Настройки окружения сервиса должны быть заведены в файле `.env`. Для этого в корне проекта находится шаблон этого файла `.env.example`     


## 2. Реализация и тестирование
### 2.1. Модуль «Аутентификация и авторизация»
Оформлен в виде отдельного NestJS-модуля `AuthModule` (файл `./src/auth/auth.module.ts`). Хранение сессии реализовано посредством библиотеки `passport.js` и стратегии `JWT` (файл `./src/auth/jwt.strategy.ts`). Стратегия выполняет валидацию токена как при http-запросах, так и при использовании web socket. Генерируемый токен включает в себе данные пользователя: `id`, `email` и `role`. Данные сессии хранятся и передаются с помощью `cookies`.
Для валидации сессии с учетом ролей в модуле `auth` созданы специальные гуарды. Например, с помощью `JwtAuthRoleGuard` (файл `./src/auth/guards/jwt-auth-role.guard.ts`) можно ограничивать использование методов контроллера только при наличии нужной роли.
С помощью декоратора `Roles` (файл `./src/auth/decorators/roles.decorator.ts`) для каждого метод декоратора можно указать допустимые роли: 
```
@Roles(ROLE.CLIENT, ROLE.MANAGER)
```
Декоратор `User` позволяет получать данные авторизованного пользователя: 
```
@User() user: UserDocument
```
Проверки входных данных в запросах реализованы с помощью `class-validator`

#### 2.1.1. Вход 
Запрос `POST` на `http://localhost/api/auth/login`

##### Не указаны поля для регистрации (пустое тело запроса)
Результат: 
```
{
    "message": [
        "Поле email обязательна для заполнения",
        "Некорректный формат почты",
        "Поле password обязательно для заполнения",
        "Пароль должно быть строкой"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Незарегистрированная почта  
Тело запроса: 
```
{ 
    "email": "admin_ivalid@mail.ru",
    "password": "admin" 
}
```
Результат: 
```
{
    "message": "Неверный логин или пароль",
    "error": "Unauthorized",
    "statusCode": 401
}
```

##### Неверный пароль
Тело запроса: 
```
{ 
    "email": "admin@mail.ru",
    "password": "admin_invalid" 
}
```
Результат: 
```
{
    "message": "Неверный логин или пароль",
    "error": "Unauthorized",
    "statusCode": 401
}
```

##### Корректные данные
Тело запроса: 
```
{ 
    "email": "admin@mail.ru",
    "password": "admin" 
}
```
Результат (статус `200`): 
```
{
    "email": "admin@mail.ru",
    "name": "admin",
    "contactPhone": "+79000000001"
}
```

##### Повторный вход уже аутентифицированного пользователя 
Результат: 
```
{
    "message": "Доступно только не аутентифицированным пользователям",
    "error": "Forbidden",
    "statusCode": 403
}
```

#### 2.1.2. Выход 

Запрос `POST` на `http://localhost/api/auth/logout`
##### Выход аутентифицированного пользователя
В ответ приходит статус `200`. Сессия завершается, Cookies удаляются. 

##### Выход не аутентифицированного пользователя 
Результат: 
```
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

#### 2.1.3. Регистрация
Запрос `POST` на `http://localhost/api/client/register`

##### Не указаны поля для регистрации (пустое тело запроса)
Результат: 
```
{
    "message": [
        "Поле email обязательно для заполнения",
        "Некорректный формат почты",
        "Поле password обязательно для заполнения",
        "Пароль должен быть не более 20 символов",
        "Пароль должен быть не менее 4 символов",
        "Пароль должно быть строкой",
        "Поле name обязательно для заполнения",
        "Имя пользователя должно быть не менее 4 символов",
        "Имя пользователя должно быть строкой"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Некорректные данные
Тело запроса: 
```
{ 
    "email": "user_invalid_mail.ru", 
    "password": "очень длиииииииииииинный пароль",
    "name": "", 
    "contactPhone": "+12345678999_invalid"
}
```
Результат: 
```
{
    "message": [
        "Некорректный формат почты",
        "Пароль должен быть не более 20 символов",
        "Поле name обязательно для заполнения",
        "Имя пользователя должно быть не менее 4 символов",
        "Некорректный номер телефона"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Email уже занят
Почта `admin@mail.ru` уже занята зарегистрированным пользователем `admin`.
Тело запроса: 
```
{ 
    "email": "admin@mail.ru", 
    "password": "Иванов Иван",
    "name": "Иванов Иван", 
    "contactPhone": "+79005678999"
}
```
Результат: 
```
{
    "message": "Email уже занят",
    "error": "Conflict",
    "statusCode": 409
}
```

##### Попытка указать role для клиента
Тело запроса: 
```
{ 
    "email": "client@mail.ru", 
    "password": "client",
    "name": "Клиент как попытка быть админом", 
    "contactPhone": "+79005678999",
    "role": "admin" 
}
```
Результат: 
```
{
    "id": "676871aa930cb10fa8c3b053",
    "email": "client@mail.ru",
    "name": "Клиент как попытка быть админом"
}
```
Пользователь зарегистрирован, но с ролью `client`. Данные в БД: 
```
{
  "_id": {
    "$oid": "676871aa930cb10fa8c3b053"
  },
  "email": "client@mail.ru",
  "passwordHash": "$2b$10$rvpNgkPH//Jlg1c8q8wgO.3mYKjTgGDSF4gBkmR9akD.iLgOD5LNi",
  "name": "Клиент как попытка быть админом",
  "contactPhone": "+79005678999",
  "role": "client",
  "__v": 0
}
```

##### Корректные данные 
Тело запроса: 
```
{ 
    "email": "ivanov@mail.ru", 
    "password": "ivanov",
    "name": "Иванов", 
    "contactPhone": "+79000002001"
}
```
Результат: 
```
{
    "id": "6768754b930cb10fa8c3b056",
    "email": "ivanov@mail.ru",
    "name": "Иванов"
}
```
Данные в БД: 
```
{
  "_id": {
    "$oid": "6768754b930cb10fa8c3b056"
  },
  "email": "ivanov@mail.ru",
  "passwordHash": "$2b$10$S6b/NHyuhw.YA0Z/ArOXSOTviFun33jabIbh6htJ/pf9IWZvP9t4m",
  "name": "Иванов",
  "contactPhone": "+79000002001",
  "role": "client",
  "__v": 0
}
```
Для дальнейшего тестирования созданы аналогичные клиенты `petrov` и `sidorov`.


### 2.2. Модуль «Управление пользователями»
Оформлен в виде отдельного NestJS-модуля `UserModule` (файл `./src/user/user.module.ts`).
Форматирование схожих выходных данных для разных методов осуществляется с помощью интерсептора `UserResponseInterceptor` (файл `.src/user/interceptors/user-response.interceptor.ts`). 

#### 2.2.1. Создание пользователя
Запрос `POST` на `http://localhost/api/auth/login`

##### Пользователь не аутентифицирован 
Результат: 
```
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

##### Недостаточно полномочий 
Предварительно произведена аутентификация под пользователем `client`
Результат: 
```
{
    "message": "Недостаточно прав для роли client",
    "error": "Forbidden",
    "statusCode": 403
}
```

##### Создание пользователя `manager`
Предварительно произведена аутентификация под пользователем `admin`
Тело запроса: 
```
{ 
    "email": "manager@mail.ru", 
    "password": "manager",
    "name": "Менеджер", 
    "contactPhone": "79000001001",
    "role": "manager" 
}
```
Результат: 
```
{
    "id": "6768814c930cb10fa8c3b066",
    "email": "manager@mail.ru",
    "name": "Менеджер",
    "contactPhone": "79000001001",
    "role": "manager"
}
```

Данные в БД: 
```
{
  "_id": {
    "$oid": "6768814c930cb10fa8c3b066"
  },
  "email": "manager@mail.ru",
  "passwordHash": "$2b$10$/vuMXxTm/q76ZlZMSKI.q.Hu9XiNF6Y/yV7.c9dv94BvQa7bceJLu",
  "name": "Менеджер",
  "contactPhone": "79000001001",
  "role": "manager",
  "__v": 0
}
```

#### 2.2.2. Получение списка пользователей
Запрос `GET` на `http://localhost/api/admin/users` (доступен для пользователей с ролью `admin`). 
Или `GET` на `http://localhost/api/manager/users` (для роли `manager` соответственно). 
Используем первый вариант. 

##### Все пользователи 
Результат: 
```
[
    {
        "id": "66ce2fd1ff15b0a9a9190001",
        "email": "admin@mail.ru",
        "name": "admin",
        "contactPhone": "+79000000001"
    },
    {
        "id": "676871aa930cb10fa8c3b053",
        "email": "client@mail.ru",
        "name": "Клиент как попытка быть админом",
        "contactPhone": "+79005678999"
    },
    {
        "id": "6768754b930cb10fa8c3b056",
        "email": "ivanov@mail.ru",
        "name": "Иванов",
        "contactPhone": "+79000002001"
    },
    {
        "id": "676875cf930cb10fa8c3b059",
        "email": "petrov@mail.ru",
        "name": "Петров",
        "contactPhone": "+79000002002"
    },
    {
        "id": "676875e9930cb10fa8c3b05c",
        "email": "sidorov@mail.ru",
        "name": "Сидоров",
        "contactPhone": "+79000002003"
    },
    {
        "id": "6768814c930cb10fa8c3b066",
        "email": "manager@mail.ru",
        "name": "Менеджер",
        "contactPhone": "79000001001"
    }
]
```

##### Фильтр по имени `name=р` 
Запрос `GET` на `http://localhost/api/admin/users?name=р`
Результат: 
```
[
    {
        "id": "676875cf930cb10fa8c3b059",
        "email": "petrov@mail.ru",
        "name": "Петров",
        "contactPhone": "+79000002002"
    },
    {
        "id": "676875e9930cb10fa8c3b05c",
        "email": "sidorov@mail.ru",
        "name": "Сидоров",
        "contactPhone": "+79000002003"
    },
    {
        "id": "6768814c930cb10fa8c3b066",
        "email": "manager@mail.ru",
        "name": "Менеджер",
        "contactPhone": "79000001001"
    }
]
```

##### Фильтр по почте `email=min` 
Запрос `GET` на `http://localhost/api/admin/users?email=min`
Результат: 
```
[
    {
        "id": "66ce2fd1ff15b0a9a9190001",
        "email": "admin@mail.ru",
        "name": "admin",
        "contactPhone": "+79000000001"
    }
]
```

##### Фильтр по номеру телефона `contactPhone=00100` 
Запрос `GET` на `http://localhost/api/admin/users?contactPhone=00100`
Результат:  
```
[
    {
        "id": "6768814c930cb10fa8c3b066",
        "email": "manager@mail.ru",
        "name": "Менеджер",
        "contactPhone": "79000001001"
    }
]
```


### 2.3. Модуль «Гостиницы»
Оформлен в виде отдельного NestJS-модуля `HotelModule` (файл `./src/hotel/hotel.module.ts`).
Выделено 2 отдельных сервиса `HotelService` и `HotelRoomService` реализующие описанные в задание интерфейсы.
Форматирование выходных данных аналогичным образом реализовано с помощью интерсепторов `HotelResponseInterceptor` и `HotelRoomResponseInterceptor`. 
Для контроля активности параметра `isEnabled` создан гуар `RoomEnabledGuard`

#### 2.3.1. Добавление гостиницы
Запрос `POST` на `http://localhost/api/admin/hotels`
Предварительно произведен вход под пользователем `admin`

##### Некорректные данные
Тело запроса: 
```
{ 
    "title": "",
    "description": 1
}
```
Результат: 
```
{
    "message": [
        "Название гостиницы не может быть пустым",
        "Описание должно быть строкой"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Корректные данные
Тело запроса: 
```
{ 
    "title": "Отель 5 ⭐",
    "description": "Лучший отель в городе!"
}
```
Результат: 
```
{
    "id": "676889a7930cb10fa8c3b07d",
    "title": "Отель 5 ⭐",
    "description": "Лучший отель в городе!"
}
```
Данные в БД: 
```
{
  "_id": {
    "$oid": "676889a7930cb10fa8c3b07d"
  },
  "title": "Отель 5 ⭐",
  "description": "Лучший отель в городе!",
  "createdAt": {
    "$date": "2024-12-22T21:50:31.754Z"
  },
  "updatedAt": {
    "$date": "2024-12-22T21:50:31.754Z"
  },
  "__v": 0
}
```
Аналогичным образом добавлены еще несколько отелей 

#### 2.3.2. Получение списка гостиниц
Запрос `GET` на `http://localhost/api/admin/hotels`

##### Все гостиницы
Результат: 
```
[
    {
        "id": "676889a7930cb10fa8c3b07d",
        "title": "Отель 5 ⭐",
        "description": "Лучший отель в городе!"
    },
    {
        "id": "67688a63930cb10fa8c3b080",
        "title": "Отель 4 ⭐",
        "description": "Почти как 5, но дешевле"
    },
    {
        "id": "67688a75930cb10fa8c3b083",
        "title": "Отель 3 ⭐",
        "description": "Все необходимое по доступной цене"
    },
    {
        "id": "67688a9a930cb10fa8c3b086",
        "title": "Отель 2 ⭐"
    },
    {
        "id": "67688a9c930cb10fa8c3b089",
        "title": "Отель 1 ⭐"
    }
]
```

##### Фильтр по заголовку `title=1` 
Запрос `GET` на `http://localhost/api/admin/hotels?title=1`
Результат: 
```
[
    {
        "id": "67688a9c930cb10fa8c3b089",
        "title": "Отель 1 ⭐"
    }
]
```
#### 2.3.3. Изменение описания гостиницы

##### Несуществующий id отеля 
Запрос `PUT` на `http://localhost/api/admin/hotels/67688a9c930cb10fa8c3bbbb`
Результат: 
```
{
    "message": "Гостиница с id \"67688a9c930cb10fa8c3bbbb\" не найдена",
    "error": "Not Found",
    "statusCode": 404
}
```

##### Некорректные данные
Тело запроса (пустой заголовок, описание как число): 
```
{ 
    "title": "", 
    "description": 1
}
```
Результат: 
```
{
    "message": [
        "Название гостиницы не должно быть пустым",
        "Описание должно быть строкой"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Корректные данные
Запрос `PUT` на `http://localhost/api/admin/hotels/67688a9c930cb10fa8c3b089`
Где `67688a9c930cb10fa8c3b089` - id отеля `1 ⭐`
```
{ 
    "title": "Отель 1,5 ⭐", 
    "description": "Мы стали чуть лучше!"
}
```
Результат: 
```
{
    "id": "67688a9c930cb10fa8c3b089",
    "title": "Отель 1,5 ⭐",
    "description": "Мы стали чуть лучше!"
}
```

##### Повторный фильтр по заголовку `title=1` после обновления отеля  
Запрос `GET` на `http://localhost/api/admin/hotels?title=1`
Результат: 
```
[
    {
        "id": "67688a9c930cb10fa8c3b089",
        "title": "Отель 1,5 ⭐",
        "description": "Мы стали чуть лучше!"
    }
]
```

#### 2.3.4. Добавление номера
Запрос `POST` на `http://localhost/api/admin/hotel-rooms`

##### Не указан `hotelId` гостиницы 
Результат: 
```
{
    "message": [
        "ID гостиницы не может быть пустым"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Корректные данные 
Тело запроса  (в формате `multipart/form-data`): 
```
hotelId:676889a7930cb10fa8c3b07d 
images(тип File):[выбрано 2 файла jpg]
description:Номер 501
```
Где `676889a7930cb10fa8c3b07d` - id отеля `5 ⭐`
Файлы для поля images прикрепляются в postman с локального диска.
Все файлы для тестовых примеров доступны в папке `./public/mock`
Результат: 
```
{
    "id": "6768962a930cb10fa8c3b0ad",
    "description": "Номер 501",
    "images": [
        "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
        "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
    ],
    "isEnabled": true,
    "hotel": {
        "id": "676889a7930cb10fa8c3b07d",
        "title": "Отель 5 ⭐",
        "description": "Лучший отель в городе!"
    }
}
```
Изображения сохраняются в папку `./public/uploads/hotels/id_гостиницы/id_номера/[изображения]`
Аналогичным образом добавлены еще несколько номеров.  

#### 2.3.5. Изменение описания номера
Запрос `PUT` на `http://localhost/api/admin/hotel-rooms/676899ab930cb10fa8c3b0b5`
Где `676899ab930cb10fa8c3b0b5` - id номера `401`
Тело запроса  (в формате `multipart/form-data`): 
```
images(тип File):[выбран новый файл]
description:Номер 401 (после реновации)
isEnabled:true
```
Результат: 
```
{
    "id": "676899ab930cb10fa8c3b0b5",
    "description": "Номер 401 (после реновации)",
    "images": [
        "public/uploads/hotels/67688a63930cb10fa8c3b080/676899ab930cb10fa8c3b0b5/4.1.jpg"
    ],
    "isEnabled": true,
    "hotel": {
        "id": "67688a63930cb10fa8c3b080",
        "title": "Отель 4 ⭐",
        "description": "Почти как 5, но дешевле"
    }
}
```
Добавлено новое изображение к описанию отеля. 

#### 2.3.6. Поиск номеров
Запрос `GET` на `http://localhost/api/common/hotel-rooms`
Предварительно для номера `502` флаг `isEnabled` установлен в `false`

##### Все номера (пользователь не аутентифицирован)
Результат: 
```
[
    {
        "id": "6768962a930cb10fa8c3b0ad",
        "description": "Номер 501",
        "images": [
            "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
            "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
        ],
        "isEnabled": true,
        "hotel": {
            "id": "676889a7930cb10fa8c3b07d",
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    },
    {
        "id": "676899ab930cb10fa8c3b0b5",
        "description": "Номер 401",
        "images": [],
        "isEnabled": true,
        "hotel": {
            "id": "67688a63930cb10fa8c3b080",
            "title": "Отель 4 ⭐",
            "description": "Почти как 5, но дешевле"
        }
    }
] 
```
Номер `502` не попадает в список. 

##### Все номера (пользователь аутентифицирован)
Результат: 
```
[
    {
        "id": "6768962a930cb10fa8c3b0ad",
        "description": "Номер 501",
        "images": [
            "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
            "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
        ],
        "isEnabled": true,
        "hotel": {
            "id": "676889a7930cb10fa8c3b07d",
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    },
    {
        "id": "67689985930cb10fa8c3b0b1",
        "description": "Номер 502",
        "images": [],
        "isEnabled": false,
        "hotel": {
            "id": "676889a7930cb10fa8c3b07d",
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    },
    {
        "id": "676899ab930cb10fa8c3b0b5",
        "description": "Номер 401",
        "images": [],
        "isEnabled": true,
        "hotel": {
            "id": "67688a63930cb10fa8c3b080",
            "title": "Отель 4 ⭐",
            "description": "Почти как 5, но дешевле"
        }
    }
]
```
Номер `502` с не активным флагом `isEnabled` попадает в список. 

##### Фильтр по отелю `hotel=676889a7930cb10fa8c3b07d`
Где `676889a7930cb10fa8c3b07d` - id отеля `5 ⭐`
Запрос `GET` на `http://localhost/api/common/hotel-rooms?hotel=676889a7930cb10fa8c3b07d`
Результат: 
```
[
    {
        "id": "6768962a930cb10fa8c3b0ad",
        "description": "Номер 501",
        "images": [
            "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
            "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
        ],
        "isEnabled": true,
        "hotel": {
            "id": "676889a7930cb10fa8c3b07d",
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    },
    {
        "id": "67689985930cb10fa8c3b0b1",
        "description": "Номер 502",
        "images": [],
        "isEnabled": false,
        "hotel": {
            "id": "676889a7930cb10fa8c3b07d",
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    }
]
```
Выведены только номера отеля `5 ⭐`

##### Количество и смещение: `limit=1&offset=2`
Запрос `GET` на `http://localhost/api/common/hotel-rooms?limit=1&offset=2`
Результат: 
```
[
    {
        "id": "676899ab930cb10fa8c3b0b5",
        "description": "Номер 401",
        "images": [],
        "isEnabled": true,
        "hotel": {
            "id": "67688a63930cb10fa8c3b080",
            "title": "Отель 4 ⭐",
            "description": "Почти как 5, но дешевле"
        }
    }
]
```
Выводится последний отель (третий, после двух)

#### 2.3.7. Информация о конкретном номере
Запрос `GET` на `http://localhost/api/common/hotel-rooms/6768962a930cb10fa8c3b0ad`
Где `6768962a930cb10fa8c3b0ad` - id номера `501`
Результат: 
```
{
    "id": "6768962a930cb10fa8c3b0ad",
    "description": "Номер 501",
    "images": [
        "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
        "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
    ],
    "isEnabled": true,
    "hotel": {
        "id": "676889a7930cb10fa8c3b07d",
        "title": "Отель 5 ⭐",
        "description": "Лучший отель в городе!"
    }
}
```


### 2.4. Модуль «Бронирование»
Оформлен в виде отдельного NestJS-модуля `ReservationModule` (файл `./src/hotel/reservation.module.ts`).
Форматирование выходных данных аналогичным образом реализовано с помощью интерсептора `ReservationResponseInterceptor`

#### 2.4.1. Бронирование номера клиентом
Запрос `POST` на `http://localhost/api/client/reservations`
Предварительно произведен вход под пользователем `ivanov`. 

##### Некорректные данные (пустое тело запроса) 
Результат: 
```
{
    "message": [
        "ID номера не может быть пустым",
        "Начало бронирования не может быть пустым",
        "Начало бронирования должно быть датой",
        "Окончание бронирования не может быть пустым",
        "Окончание бронирования должно быть датой"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Дата начала меньше конца
Тело запроса: 
```
{ 
    "hotelRoom": "6768962a930cb10fa8c3b0ad", 
    "startDate": "2024-12-30",
    "endDate": "2024-12-20"
}
```
Результат: 
```
{
    "message": "Дата начала бронирования не может быть больше даты окончания",
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Несуществующий id номера
Результат: 
```
{
    "message": "Номер с id \"675ac9a90c2444962756d555\" не найден",
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Номер не активен
Тело запроса: 
```
{ 
    "hotelRoom": "67689985930cb10fa8c3b0b1", 
    "startDate": "2024-12-16",
    "endDate": "2024-12-18"
}
```
Где `67689985930cb10fa8c3b0b1` - id неактивного номера `502`
Результат: 
```
{
    "message": "Номер с id \"67689985930cb10fa8c3b0b1\" недоступен",
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Корректные данные
Тело запроса: 
```
{ 
    "hotelRoom": "6768962a930cb10fa8c3b0ad", // номер 501
    "startDate": "2024-12-01",
    "endDate": "2024-12-05"
}
```
Результат: 
```
{
    "startDate": "Sun Dec 01 2024",
    "endDate": "Thu Dec 05 2024",
    "hotelRoom": {
        "description": "Номер 501",
        "images": [
            "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
            "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
        ]
    },
    "hotel": {
        "title": "Отель 5 ⭐",
        "description": "Лучший отель в городе!"
    }
}
```
Аналогичным образом для пользователя `ivanov` был добавлен еще список броней 

##### Номер занят (пересечение дат)
Тело запроса: 
```
{ 
    "hotelRoom": "6768962a930cb10fa8c3b0ad", // номер 501
    "startDate": "2024-12-03",
    "endDate": "2024-12-10"
}
```
Результат: 
```
{
    "message": "Номер уже занят",
    "error": "Bad Request",
    "statusCode": 400
}
```

#### 2.4.2. Список броней текущего пользователя 
Запрос `GET` на `http://localhost/api/client/reservations`
Предварительно произведен вход под пользователем `ivanov`

##### Корректные данные 
Результат: 
```
[
    {
        "startDate": "Sun Dec 01 2024",
        "endDate": "Thu Dec 05 2024",
        "hotelRoom": {
            "description": "Номер 501",
            "images": [
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
            ]
        },
        "hotel": {
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    },
    {
        "startDate": "Sun Dec 08 2024",
        "endDate": "Tue Dec 10 2024",
        "hotelRoom": {
            "description": "Номер 501",
            "images": [
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
            ]
        },
        "hotel": {
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    },
    {
        "startDate": "Sun Dec 15 2024",
        "endDate": "Fri Dec 20 2024",
        "hotelRoom": {
            "description": "Номер 501",
            "images": [
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
            ]
        },
        "hotel": {
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    }
]
```

##### Броней нет
Предварительно произведен вход под пользователем `petrov`
Результат: 
```
[]
```
Возвращается пустой массив 


#### 2.4.3. Отмена бронирования клиентом 
Запрос `DELETE` на `http://localhost/api/client/reservations/6768aafb803b32a875d731c6`
Где `6768aafb803b32a875d731c6` - id бронирования `ivanov` с 2024-12-15 по 2024-12-20

##### Бронирование другого пользователя 
Предварительно произведен вход под пользователем `petrov`
Результат: 
```
{
    "message": "Нет доступа к данному бронированию",
    "error": "Forbidden",
    "statusCode": 403
}
```

##### Корректные данные
Предварительно произведен вход под пользователем `ivanov`
Результат (статус `200`): 
```
{  
}
```

##### Список броней пользователя `ivanov` после отмены броней 
Запрос `GET` на `http://localhost/api/client/reservations`
Результат: 
```
[
    {
        "startDate": "Sun Dec 01 2024",
        "endDate": "Thu Dec 05 2024",
        "hotelRoom": {
            "description": "Номер 501",
            "images": [
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
            ]
        },
        "hotel": {
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    },
    {
        "startDate": "Sun Dec 08 2024",
        "endDate": "Tue Dec 10 2024",
        "hotelRoom": {
            "description": "Номер 501",
            "images": [
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
            ]
        },
        "hotel": {
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    }
]
```

#### 2.4.4. Список броней конкретного пользователя
Запрос `GET` на `http://localhost/api/client/reservations/6768754b930cb10fa8c3b056`
Где `6768754b930cb10fa8c3b056` - id пользователя `ivanov`
Предварительно произведен вход под пользователем `manager`
Результат: 
```
[
    {
        "startDate": "Sun Dec 01 2024",
        "endDate": "Thu Dec 05 2024",
        "hotelRoom": {
            "description": "Номер 501",
            "images": [
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
            ]
        },
        "hotel": {
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    },
    {
        "startDate": "Sun Dec 08 2024",
        "endDate": "Tue Dec 10 2024",
        "hotelRoom": {
            "description": "Номер 501",
            "images": [
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
            ]
        },
        "hotel": {
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    }
]
```

#### 2.4.5. Отмена бронирования менеджером
Запрос `DELETE` на `http://localhost/api/client/reservations/6768aaf1803b32a875d731bf`
Где `6768aaf1803b32a875d731bf` - id бронирования `ivanov` с 2024-12-15 по 2024-12-20
Предварительно произведен вход под пользователем `manager`
Результат (статус `200`): 
```
{  
}
```

##### Список броней пользователя `ivanov` после отмены броней 
Запрос `GET` на `http://localhost/api/client/reservations/6768754b930cb10fa8c3b056`
Результат: 
```
[
    {
        "startDate": "Sun Dec 01 2024",
        "endDate": "Thu Dec 05 2024",
        "hotelRoom": {
            "description": "Номер 501",
            "images": [
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.1.jpg",
                "uploads/hotels/676889a7930cb10fa8c3b07d/6768962a930cb10fa8c3b0ad/5.2.jpg"
            ]
        },
        "hotel": {
            "title": "Отель 5 ⭐",
            "description": "Лучший отель в городе!"
        }
    }
]
```


### 2.5. Модуль «Чат с техподдрежкой»
Оформлен в виде отдельного NestJS-модуля `SupportRequestModule` (файл `./src/support-request/support-request.module.ts`).
Выделено 3 отдельных сервиса `SupportRequestService`, `SupportRequestClientService` и `SupportRequestEmployeeService` реализующие описанные в задание интерфейсы. При чем последние два наследуются от первого сервиса. 
Форматирование выходных данных для обращений и сообщений аналогичным образом реализовано с помощью интерсепторов `SupportRequestResponseInterceptor` и `MessageResponseInterceptor`.

#### 2.5.1. Создание обращения в поддержку
Запрос `POST` на `http://localhost/api/client/support-requests`
Предварительно произведен вход под пользователем `ivanov`

##### Не указаны необходимые поля (пустое тело запроса)
Результат: 
```
{
    "message": [
        "Поле text не может быть пустым",
        "Текст обращения должен быть строкой"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

##### Корректные данные 
Тело запроса: 
```
{ 
    "text": "Первое обращение от Иванова"
}
```
Результат: 
```
{
    "id": "67692522930cb10fa8c3b11f",
    "createdAt": "Mon Dec 23 2024 08:53:54 GMT+0000 (Coordinated Universal Time)",
    "isActive": true,
    "hasNewMessages": true
}
```
Данные в БД: 
```
{
  "_id": {
    "$oid": "67692522930cb10fa8c3b11f"
  },
  "user": {
    "$oid": "6768754b930cb10fa8c3b056"
  },
  "createdAt": {
    "$date": "2024-12-23T08:53:54.546Z"
  },
  "messages": [
    {
      "author": {
        "$oid": "6768754b930cb10fa8c3b056"
      },
      "sentAt": {
        "$date": "2024-12-23T08:53:54.547Z"
      },
      "text": "Первое обращение от Иванова",
      "_id": {
        "$oid": "67692522930cb10fa8c3b120"
      }
    }
  ],
  "isActive": true,
  "__v": 0
}
```
Аналогичным образом создано еще одно обращение с неактивным параметром `isActive` для пользователя `ivanov` и еще одно активное для пользователя `petrov`. 

#### 2.5.2. Получение списка обращений в поддержку для клиента
Запрос `GET` на `http://localhost/api/client/support-requests`

##### Все обращения 
Предварительно произведен вход под пользователем `ivanov`
Результат: 
```
[
    {
        "id": "67692522930cb10fa8c3b11f",
        "createdAt": "Mon Dec 23 2024 08:53:54 GMT+0000 (Coordinated Universal Time)",
        "isActive": true,
        "hasNewMessages": true
    },
    {
        "id": "676925bd930cb10fa8c3b127",
        "createdAt": "Mon Dec 23 2024 08:56:29 GMT+0000 (Coordinated Universal Time)",
        "isActive": false,
        "hasNewMessages": true
    }
]
```
Обращение с неактивным параметром `isActive` выводится. 

##### Фильтр `isActive=true`  
Запрос `GET` на `http://localhost/api/client/support-requests?isActive=true`
Результат: 
```
[
    {
        "id": "67692522930cb10fa8c3b11f",
        "createdAt": "Mon Dec 23 2024 08:53:54 GMT+0000 (Coordinated Universal Time)",
        "isActive": true,
        "hasNewMessages": true
    }
]
```
Выводится только активное обращение 

##### Обращений у пользователя нет 
Предварительно произведен вход под пользователем `sidorov`
Результат: 
```
[]
```

#### 2.5.3. Получение списка обращений в поддержку для менеджера
Запрос `GET` на `http://localhost/api/manager/support-requests`
Предварительно произведен вход под пользователем `manager`
Результат: 
```
[
    {
        "id": "67692522930cb10fa8c3b11f",
        "createdAt": "Mon Dec 23 2024 08:53:54 GMT+0000 (Coordinated Universal Time)",
        "isActive": true,
        "hasNewMessages": true,
        "client": {
            "id": "6768754b930cb10fa8c3b056",
            "name": "Иванов",
            "email": "ivanov@mail.ru",
            "contactPhone": "+79000002001"
        }
    },
    {
        "id": "676925bd930cb10fa8c3b127",
        "createdAt": "Mon Dec 23 2024 08:56:29 GMT+0000 (Coordinated Universal Time)",
        "isActive": false,
        "hasNewMessages": true,
        "client": {
            "id": "6768754b930cb10fa8c3b056",
            "name": "Иванов",
            "email": "ivanov@mail.ru",
            "contactPhone": "+79000002001"
        }
    },
    {
        "id": "67692880930cb10fa8c3b143",
        "createdAt": "Mon Dec 23 2024 09:08:16 GMT+0000 (Coordinated Universal Time)",
        "isActive": true,
        "hasNewMessages": true,
        "client": {
            "id": "676875cf930cb10fa8c3b059",
            "name": "Петров",
            "email": "petrov@mail.ru",
            "contactPhone": "+79000002002"
        }
    }
]
```

#### 2.5.4. Отправка сообщения
Запрос `POST` на `http://localhost/api/common/support-requests/67692522930cb10fa8c3b11f/messages`
Где `67692522930cb10fa8c3b11f` - id первого обращения от `ivanov` 
Тело запроса: 
```
{ 
    "text": "Сообщение Иванов 01-01"
}
```
Результат: 
```
{
    "id": "67692a23930cb10fa8c3b15b",
    "createdAt": "Mon Dec 23 2024 09:15:15 GMT+0000 (Coordinated Universal Time)",
    "text": "Сообщение Иванов 01-01",
    "author": {
        "id": "6768754b930cb10fa8c3b056",
        "name": "Иванов"
    }
}
```
Аналогичным образом добавлены еще несколько сообщений 

#### 2.5.5. Получение истории сообщений из обращения в техподдержку
Запрос `GET` на `http://localhost/api/common/support-requests/67692522930cb10fa8c3b11f/messages`
Где `67692522930cb10fa8c3b11f` - id первого обращения от `ivanov`

##### Корректные данные 
Предварительно произведен вход под пользователем `ivanov`
Результат: 
```
[
    {
        "id": "67692522930cb10fa8c3b120",
        "createdAt": "Mon Dec 23 2024 08:53:54 GMT+0000 (Coordinated Universal Time)",
        "text": "Первое обращение от Иванова",
        "author": {
            "id": "6768754b930cb10fa8c3b056",
            "name": "Иванов"
        }
    },
    {
        "id": "67692a23930cb10fa8c3b15b",
        "createdAt": "Mon Dec 23 2024 09:15:15 GMT+0000 (Coordinated Universal Time)",
        "text": "Сообщение Иванов 01-01",
        "author": {
            "id": "6768754b930cb10fa8c3b056",
            "name": "Иванов"
        }
    },
    {
        "id": "67692a47930cb10fa8c3b169",
        "createdAt": "Mon Dec 23 2024 09:15:51 GMT+0000 (Coordinated Universal Time)",
        "text": "Сообщение Иванов 01-02",
        "author": {
            "id": "6768754b930cb10fa8c3b056",
            "name": "Иванов"
        }
    },
    {
        "id": "67692a49930cb10fa8c3b179",
        "createdAt": "Mon Dec 23 2024 09:15:53 GMT+0000 (Coordinated Universal Time)",
        "text": "Сообщение Иванов 01-03",
        "author": {
            "id": "6768754b930cb10fa8c3b056",
            "name": "Иванов"
        }
    }
]
```
Аналогичный результат при запросе от пользователя `manager`

##### Запрос чужой истории сообщений
Предварительно произведен вход под пользователем `petrov`
Запрос `GET` все еще на `http://localhost/api/common/support-requests/67692522930cb10fa8c3b11f/messages`
Где `67692522930cb10fa8c3b11f` - id обращения от `ivanov`
Результат: 
```
{
    "message": "Нет доступа к данному обращению",
    "error": "Forbidden",
    "statusCode": 403
}
```

#### 2.5.6. Отправка события, что сообщения прочитаны 
Запрос `POST` на `http://localhost/api/common/support-requests/67692522930cb10fa8c3b11f/messages/read`
Где `67692522930cb10fa8c3b11f` - id обращения от `ivanov`
Предварительно произведен вход под пользователем `manager`, Иванов сам у себя не может прочитать сообщения. 
Тело запроса: 
```
{ 
    "createdBefore": "2024-12-23T09:15:52"
}
```
Результат: 
```
{
    "success": true
}
```

##### Повторное получение истории сообщений 
Запрос `GET` на `http://localhost/api/common/support-requests/67692522930cb10fa8c3b11f/messages`
Результат: 
```
[
    {
        "id": "67692522930cb10fa8c3b120",
        "createdAt": "Mon Dec 23 2024 11:53:54 GMT+0300 (Москва, стандартное время)",
        "text": "Первое обращение от Иванова",
        "readAt": "Mon Dec 23 2024 12:41:24 GMT+0300 (Москва, стандартное время)",
        "author": {
            "id": "6768754b930cb10fa8c3b056",
            "name": "Иванов"
        }
    },
    {
        "id": "67692a23930cb10fa8c3b15b",
        "createdAt": "Mon Dec 23 2024 12:15:15 GMT+0300 (Москва, стандартное время)",
        "text": "Сообщение Иванов 01-01",
        "readAt": "Mon Dec 23 2024 12:41:24 GMT+0300 (Москва, стандартное время)",
        "author": {
            "id": "6768754b930cb10fa8c3b056",
            "name": "Иванов"
        }
    },
    {
        "id": "67692a47930cb10fa8c3b169",
        "createdAt": "Mon Dec 23 2024 12:15:51 GMT+0300 (Москва, стандартное время)",
        "text": "Сообщение Иванов 01-02",
        "readAt": "Mon Dec 23 2024 12:41:24 GMT+0300 (Москва, стандартное время)",
        "author": {
            "id": "6768754b930cb10fa8c3b056",
            "name": "Иванов"
        }
    },
    {
        "id": "67692a49930cb10fa8c3b179",
        "createdAt": "Mon Dec 23 2024 12:15:53 GMT+0300 (Москва, стандартное время)",
        "text": "Сообщение Иванов 01-03",
        "author": {
            "id": "6768754b930cb10fa8c3b056",
            "name": "Иванов"
        }
    }
]
```

У всех сообщений до указанной даты появилась метка прочтения `readAt`

#### 2.5.7. Работа оповещений через WebSocket
Создан отдельный компонент `SupportRequestGateway` (файл `./src/support-request/support-request.gateway.ts`) для реализации взаимодействия клиента и сервера с использование WebSocket. Подписывание на чат реализовано в виде сообщения `subscribeToSupportRequest`, обмен сообщениями через `message`

Создана простая форма для демонстрации работы чата. 

В левом окне входим под пользователем `ivanov`, в правом под `manager`. В каждом окне вводим одинаковый id чата `67692522930cb10fa8c3b11f` и нажимаем кнопку `Подписаться`
Пользователь `ivanov` в своем окне вводи первое сообщение:
![Вход. Сообщение 1](README/01.%20Вход.%20Подписка%20на%20чат.png)

После нажатия кнопки `Отправить` сообщение сразу же появляется в истории обоих подписавшихся пользователей: 
![Сообщение 1](README/03.%20Сообщение%201.png)

Пользователь `ivanov` вводит еще одно сообщение:+
![Сообщение 2](README/04-01.%20Сообщение%202.png)

После отправки сообщение снова появляется у обоих пользователей: 
![Сообщение 2. Отправка](README/04-02.%20Сообщение%202.png)

В ответ пользователь `manager` вводит свое сообщение:
![Сообщение 2. Отправка](README/05-01.%20Сообщение%20от%20менеджера.png)

И после отправки сообщение аналогично появляется у обоих пользователей: 
![Сообщение 2. Отправка](README/05-02.%20Сообщение%20от%20менеджера.png)


