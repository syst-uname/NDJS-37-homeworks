### Микросервисы

#### Создание docker compose с несколькими приложениями 

В приложении будет 3 сервиса: 
* `redis` как БД  
* сервис `counter` для подсчета просмотров  
* главное приложение `library` 

##### Отладочный вариант 
В корне проекта создан файл `docker-compose.dev.yml`: 
```
services:
  storage:
    image: redis
    volumes:
      - ./data:/data
  counter:
    image: node:22.5
    working_dir: /app
    volumes:
      - ./counter:/app
    environment:
      - PORT=3005
      - REDIS_URL=redis://storage
    ports:
      - 8080:3005
    command: npm run dev  
    depends_on:
      - storage
  library:
    image: node:22.5
    working_dir: /app
    volumes:
      - ./library:/app
    environment:
      - PORT=3006
      - COUNTER_URL=http://counter:3005
    ports:
      - 80:3006
    command: npm run dev
    depends_on:
      - counter
```
 
Запуск отладочного варианта: 
```
docker compose -f docker-compose.dev.yml up
```

Запускаются три контейнера: `storage-1`, `counter-1` и `library-1`

Остановка и удаление контейнеров: 
```
docker compose -f docker-compose.dev.yml down
``` 
Разрабатываем и отлаживаем приложение `counter` и `library`

##### Запуска через сборку 

Новый файл `docker-compose.build.yml`:
```
services:
  storage:
    image: redis
    volumes:
      - ./data:/data
  counter:
    build: ./counter
    environment:
      - PORT=3008
      - REDIS_URL=redis://storage
    ports:
      - 8080:3008
    depends_on:
      - storage
  library:
    build: ./library
    environment:
      - PORT=3009
      - COUNTER_URL=http://counter:3008
    ports:
      - 80:3009
    depends_on:
      - counter
```

Для сервисов `counter` и `library`: 
* заменяются `image: node:22.5` 
на соответствующее `build: ./counter` или  `build: ./library`
* удаляются `working_dir` и `volumes`, они будут указаны в докер файле 
* удаляется команда `command: npm run dev` - тоже будет в образе 

Запуск сборочного варианта:
```
docker compose -f docker-compose.build.yml up
```

Снова поднимаются три контейнера 

Приложение работает как в браузере, так и при запросе `curl http://localhost:8080/counter/2` (обращение только к `counter`)


##### Продуктивный вариант на основе готовых образов 

В докер хабе создан репозиторий `009-docker-02`.
Тегуем локальные образы чтобы они попали именно в этот репозиторий: 
```
docker tag 009-docker-02-counter u0name/009-docker-02:counter-v1.0.0
docker tag 009-docker-02-library u0name/009-docker-02:library-v1.0.0
```

Заливаем на докер хаб: 
```
docker push u0name/009-docker-02:counter-v1.0.0
docker push u0name/009-docker-02:library-v1.0.0
```

Полученный репозиторий на докер хабе: 
https://hub.docker.com/repository/docker/u0name/009-docker-02/general


Продуктивный вариант `docker-compose.yml`:
```
services:
  storage:
    image: redis
    volumes:
      - ./data:/data
  counter:
    image: u0name/009-docker-02:counter-v1.0.0
    environment:
      - PORT=3010
      - REDIS_URL=redis://storage
    ports:
      - 8080:3010
    depends_on:
      - storage
  library:
    image: u0name/009-docker-02:library-v1.0.0
    environment:
      - PORT=3011
      - COUNTER_URL=http://counter:3010
    ports:
      - 80:3011
    depends_on:
      - counter
```
Команды `build: ...` заменены на соответствующие имена образов на докер хабе: `image: u0name/009-docker-02:counter-v1.0.0` и ` image: u0name/009-docker-02:library-v1.0.0` 

Удаляю локальные контейнеры и образы.
Запускаю сборку:
```
docker compose up
```

Контейнеры запускаются, приложение работает

##### Пример работы приложения 
 
Вывод количества просмотров книги (цифра 20 рядом с количеством лайков):  
![Количество просмотров](README/01.%20Количество%20просмотров%20книги.png)

Обновим страницу 5 раз, количество каждый раз увеличивается и достигает значения 25: 
![Количество просмотров после обновления](README/02.%20Количество%20просмотров%20книги%20после%20нескольких%20обновлений%20страницы.png)

Запрос 
```
curl http://localhost:8080/counter/2
```
Результат: 
```
{"count":"26"}
```
