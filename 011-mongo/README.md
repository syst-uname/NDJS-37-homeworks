### Подключение MongoDB в Node.js приложение

#### Отладочный вариант 
Файл `docker-compose.dev.yml`: 
```
services:

  storage_redis:
    image: redis
    volumes:
      - ./data/redis:/data

  counter:
    image: node:22.5
    working_dir: /app
    ports:
      - 3001:3001
    volumes:
      - ./counter:/app
    environment:
      - PORT=3001
      - REDIS_URL=redis://storage_redis
    command: npm run dev  
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
    image: node:22.5
    working_dir: /app
    volumes:
      - ./library:/app
    environment:
      - PORT=3002
      - COUNTER_URL=http://counter:3001
      - MONGO_URL=mongodb://storage_mongo:27017/library
    ports:
      - 80:3002
    command: npm run dev
    depends_on:
      - counter
      - storage_mongo 
```

Добавлен новый сервис `storage_mongo`. Для инициализации БД тестовыми данными через volumes прокидывается соответствущий скрипт `init-db.js`. Через переменную окружения `MONGO_INITDB_DATABASE` задается имя БД. 

В данном виде приложение отлаживается. В модели `Book` заменено использование массива как хранилища на соответствующие обращения к БД. Реализованы сопутствующие изменения и рефакторинг. 

#### Сборочный вариант 
Файл `docker-compose.build.yml`:
```
services:

  storage_redis:
    image: redis
    volumes:
      - ./data/redis:/data

  counter:
    build: ./counter
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
    build: ./library
    ports:
      - 80:3002
    environment:
      - PORT=3002
      - COUNTER_URL=http://counter:3001
      - MONGO_URL=mongodb://storage_mongo:27017/library
    depends_on:
      - counter
      - storage_mongo 
```

Сбор образов из соответствующих докер файлов. 
Запуск контейнеров: 
```
docker compose -f docker-compose.build.yml up
```

Приложение работает, БД доступна. 

#### Продуктивный вариант 
Образы залиты на докер хаб, репозиторий `011-mongo`: https://hub.docker.com/repository/docker/u0name/011-mongo/general


Файл `docker-compose.build.yml`:
```
services:

  storage_redis:
    image: redis
    volumes:
      - ./data/redis:/data

  counter:
    image: u0name/011-mongo:counter-v1.0.0
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
    image: u0name/011-mongo:library-v1.0.0
    ports:
      - 80:3002
    environment:
      - PORT=3002
      - COUNTER_URL=http://counter:3001
      - MONGO_URL=mongodb://storage_mongo:27017/library
    depends_on:
      - counter
      - storage_mongo 
```

Удаляю локальные контейнеры и образы. Запускаю сборку `docker compose up`, приложение работает, БД доступна.  
