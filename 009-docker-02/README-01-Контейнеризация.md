### Контейнеризация приложения Библиотека 

#### Исходные данные  

На хосте в папке `009-docker-02/library` находятся папка `./src` с исходным кодом и `package.json` скопированные и доработанные из предыдущего проекта `008-ejs`. 

Версия node на хосте: 
```
node -v 
v20.15.0
```

#### Запуск контейнера с node:22.5 

Предварительно на хосте скачен образ node:22.5
```
docker run -it --rm --name library -v %cd%:/app -w /app -e PORT=3001 -p 80:3001 node:22.5 /bin/bash
```

Версия node в запущенном контейнере: 
```
node -v 
v22.5.1
```

#### Установка зависимостей 
В консоли запущенного контейнера: 
```
npm install 
```
 
В приложении появляется папка `node_modules` и файл `package-lock.json`


#### Тестирование приложения в контейнере 

В консоли контейнера: 
```
npm run dev 
```

Приложение запускается в контейнере на 3001 порту: 
```
> 009-docker-02-library@1.0.0 dev
> nodemon -L

[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/index.js`
body-parser deprecated undefined extended: provide extended option file:/app/src/index.js:13:17
Приложение запущено на порту 3001
```

В браузере по url `http://localhost/view/books/` отображается интерфейс библиотеки с данными 

При запросе с хоста `curl http://localhost/api/v1/books/` возвращается список всех книг: 
```
[{"id":1,"title":"Война и мир","authors":"Лев Николайевич Толстой","description":"Роман-эпопея Льва Николаевича Толстого, описывающий русское общество в эпоху войн против Наполеона в 1805—1812 годах. Эпилог романа доводит повествование до 1820 года.","favorite":100,"fileNameCover":"Лев Николайевич Толстой - Война и мир.jpg","fileOriginalCover":"Война и мир.jpg","fileNameBook":"Лев Николайевич Толстой - Война и мир.txt","fileOriginalBook":"Война и мир.txt"},{"id":2,"title":"JavaScript для чайников","authors":"Крис Минник и Ева Холланд","description":"JavaScript - это ключевой инструмент для создания современных веб-сайтов, и с помощью этой книги, ориентированной на новичков, вы сможете выучить язык в короткие сроки с минимальными усилиями.","favorite":70,"fileNameCover":"Крис Минник и Ева Холланд - JavaScript для чайников.jpg","fileOriginalCover":"JavaScript для чайников.jpg","fileNameBook":"Крис Минник и Ева Холланд - JavaScript для чайников.txt","fileOriginalBook":"JavaScript для чайников.txt"},{"id":3,"title":"Туда и обратно","authors":"Джон Р. Р. Толкин","description":"Путешествие хоббита Бильбо Бэггинса, волшебника Гэндальфа и тринадцати гномов во главе с Торином Дубощитом","favori   ite":60,"fileNameCover":"Джон Р. Р. Толкин - Туда и обратно.jpg","fileOriginalCover":"Туда и обратно.jpg","fileNameBook":"Джон Р. Р. Толкин - Туда и обратно.fb2","fileOriginalBook":"Туда и обратно.fb2"}]
```

#### Создание образа

В папке `009-docker-02/library` создан файл `Dockerfile` с содержанием: 
```
FROM node:22.5-alpine

WORKDIR /app
ARG NODE_ENV=production
COPY ./package*.json ./
RUN npm install
COPY ./src src/

CMD ["npm", "run", "server"] 
```

#### Запуск сборки образа 

На хосте и корня проекта 
`docker build -t library:v1.0.0 .`

```
[+] Building 4.5s (10/10) FINISHED                                                                                               docker:default
 => [internal] load build definition from Dockerfile                                                                                       0.0s
 => => transferring dockerfile: 185B                                                                                                       0.0s
 => [internal] load metadata for docker.io/library/node:22.5-alpine                                                                        0.0s
 => [internal] load .dockerignore                                                                                                          0.0s
 => => transferring context: 2B                                                                                                            0.0s
 => [1/5] FROM docker.io/library/node:22.5-alpine                                                                                          0.0s
 => [internal] load build context                                                                                                          0.1s
 => => transferring context: 1.18MB                                                                                                        0.1s
 => CACHED [2/5] WORKDIR /app                                                                                                              0.0s
 => [3/5] COPY ./package*.json ./                                                                                                          0.1s
 => [4/5] RUN npm install                                                                                                                  3.8s
 => [5/5] COPY ./src src/                                                                                                                  0.1s
 => exporting to image                                                                                                                     0.2s
 => => exporting layers                                                                                                                    0.2s
 => => writing image sha256:1d0017d060c3dd0d45338d3ce9e59195e4ab59147c1f9670add5eaed2fdf8e74                                               0.0s 
 => => naming to docker.io/library/library:v1.0.0                                                                                          0.0s 

View build details: docker-desktop://dashboard/build/default/default/bmzq9mxczobe2qa03zjokyayk

What's Next?
  View a summary of image vulnerabilities and recommendations → docker scout quickview
```

Создан образ 
```
docker images
```

|REPOSITORY|TAG|IMAGE ID|CREATED|SIZE|
|-|-|-|-|-|
|library      |v1.0.0    |1d0017d060c3   |51 seconds ago   |157MB|

#### Проверка работы приложения из созданного образа

Предварительно удаляем запущенный ранее контейнер. 
Запуск приложения из образа (для теста указан порт 3002)
```
docker run -it --rm --name library -e PORT=3002 -p 80:3002 library:v1.0.0
```
Результат: 
```
> 009-docker-02-library@1.0.0 server
> node src/index.js

body-parser deprecated undefined extended: provide extended option file:/app/src/index.js:13:17
Приложение запущено на порту 3002
```

Обращения к API выдают аналогичный результат. 

#### Публикация образа на docker hub 

Предварительно логинимся с помощью команды `docker login -u u0name` и указанием сгенерированного токена. 

Присвоение локальному образу тега: 
```
docker tag library:v1.0.0 u0name/library:v1.0.0
```

Отправка образа: 
```
docker push u0name/library:v1.0.0
```

Результат: 
```
The push refers to repository [docker.io/u0name/library]
5b9104a1db64: Pushed
8ebe87092bf4: Pushed
85afb5b438ef: Pushed
00a426bdf0b2: Mounted from u0name/counter
a64fa369054d: Mounted from u0name/counter
1a944437090a: Mounted from u0name/counter
4b76468bfe06: Mounted from u0name/counter
78561cef0761: Mounted from u0name/counter
v1.0.0: digest: sha256:8b131d5685f4b555037595c7c1d0327c85e912bc1348df2a0dbd3af26df9ebfd size: 1995
```

В результате опубликован образ 
https://hub.docker.com/repository/docker/u0name/library/general

#### Проверка работы приложения из созданного контейнера

Предварительно удаляем созданные ранее образы и контейнеры связанные с library. 
Запуск приложения из образа (для теста указан порт 3003)
```
docker run -it --rm --name library -e PORT=3003 -p 80:3003 u0name/library:v1.0.0
```
Результат: 
```
Unable to find image 'u0name/library:v1.0.0' locally
v1.0.0: Pulling from u0name/library
c6a83fedfae6: Already exists                                                                                                                           
8d90f41c769e: Already exists                                                                                                                           
c4f54159f74a: Already exists                                                                                                                           
6ecb2bd0d8e8: Already exists                                                                                                                           
d3dd804d8905: Already exists                                                                                                                           
fae4878a7889: Already exists                                                                                                                           
946afe073d95: Already exists                                                                                                                           
35eb8718c47b: Already exists                                                                                                                           
Digest: sha256:8b131d5685f4b555037595c7c1d0327c85e912bc1348df2a0dbd3af26df9ebfd
Status: Downloaded newer image for u0name/library:v1.0.0

> 009-docker-02-library@1.0.0 server
> node src/index.js

body-parser deprecated undefined extended: provide extended option file:/app/src/index.js:13:17
Приложение запущено на порту 3003
```

Обращения к API выдают аналогичный результат. 