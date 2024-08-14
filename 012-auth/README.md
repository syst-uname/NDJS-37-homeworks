### Аутентификация. Passport.js

#### Регистрация 

Роут `/user/signup` доступен как для `/view`, так и для `/api/v1`
 
Страница регистрации `http://localhost/view/user/signup`: 
![Страница регистрации](README/01.01%20Регистрация.png)

Регистрация нового пользователя: 
![Данные пользователя](README/01.02%20Регистрация.%20Заполненные%20данные.png)

Пример ошибки: 
![Пример ошибки](README/01.03%20Регистрация.%20Пример%20ошибки.png)

После успешной регистрации пользователь сохраняется в БД. 

#### Аутентификация

Страница аутентификации `http://localhost/view/user/login`: 
![Аутентификация](README/02.01%20Аутентификация.png)

Пример ошибки:
![Пример ошибки](README/02.02%20Аутентификация.%20Пример%20ошибки.png)

#### Профиль 

После регистрации и аутентификация пользователя можно просмотреть его профиль.

Профиль `http://localhost/view/user/me`:
![Профиль](README/03.01%20Профиль.png)

Информация о пользователе доступна и в боковом меню (при малом размера окна): 
![Профиль в боковом меню](README/03.02%20Профиль.%20Боковое%20меню.png)


После выхода из профиля основные функции приложения становятся недоступны: 
![Выход из профиля](README/03.03%20Профиль.%20Выход.png)

Пример авторизации под другими пользователями:
![Пользователь Admin](README/03.04%20Профиль.%20Пользователь%20Admin.png)

![Пользователь JD](README/03.05%20Профиль.%20Пользователь%20JD.png)

В БД заведены тестовые пользователи JD, BadComedian, Admin (пароли совпадают с именем пользователя).


#### Публикация 

Образы приложений library и counter опубликованы на 
https://hub.docker.com/repository/docker/u0name/012-auth/general

Файл `docker-compose.yml`: 
```
services:

  storage_redis:
    image: redis
    volumes:
      - ./data/redis:/data

  counter:
    image: u0name/012-auth:counter-v1.0.0
    ports:
      - 3001:3001
    environment:
      - PORT=3001
      - REDIS_URL=redis://storage_redis
    depends_on:
      - storage_redis

  storage_mongo:
    image: mongo 
    ports:
      - 27017:27017
    environment:
      MONGO_INITDB_DATABASE: library
    volumes:
      - ./data/mongo/init-db.js:/docker-entrypoint-initdb.d/init-db.js:ro 

  library:
    image: u0name/012-auth:library-v1.0.0
    ports:
      - 80:3002
    environment:
      - PORT=3002
      - COUNTER_URL=http://counter:3001
      - MONGO_URL=mongodb://storage_mongo:27017/library
    env_file:
      - ./library/.env      
    depends_on:
      - counter
      - storage_mongo 
```