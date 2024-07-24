### Задание 3 - Volumes

##### 1. Загрузите образ node версии 15.14

Команда: `docker pull node:15.14`

##### 2. Запустите контейнер с именем first_node из образа node версии 15.14 в фоновом режиме, подключив папку data из текущей директории в /var/first/data контейнера

Создана пустая папка `data` в текущей директории хостовой машины. 

Команда: `docker run -it -d --name first_node -v %cd%\data:/var/first/data node:15.14`
Результат: 
> e6513105bb740b2a81582b0fd6c5f53c8d317508e8a72feb5e91ffffc02f0274

*\*Не уверен в правильности одновременного использования параметров `-it` и `-d`, но без этого контейнер с node сразу после запуска останавливался*

*\*При монтировании valume использую в `%cd%\data` именно левый слэш, хотя в лекции использовался правый. Переменная `%cd%` у меня (Windows 11, cmd) возвращает `C:\Users\DIV\YandexDisk\Dev\JS\netology\NDJS-37\NDJS-37-homeworks\009-docker`. 
 Поэтому `\data` использую тоже с левым слэшем, заработало только в таком виде. Пока не понял в чем дело, кажется на видео с практикой было все то же самое, но работало с правым слэшем.*

##### 3. Запустите контейнер с именем second_node из образа node версии 15.14 в фоновом режиме, подключив папку data из текущей директории в /var/second/data контейнера

Команда: `docker run -it -d --name second_node -v %cd%\data:/var/second/data node:15.14`
Результат: 
> 575bd7e26f57d4659d1839daf80fbf19c6c0ad3f5f24d9891eb20c1455bd9b64

##### 4. Подключитесь к контейнеру first_node с помощью exec и создайте текстовый файл любого содержания в /var/first/data
 
Команда: `docker exec first_node /bin/sh -c "echo 'Hello from first_node!' > /var/first/data/first_node.txt"`

В папке `data` на хостовой машине создался файл `first_node.txt` с содержимым: 
> Hello from first_node!

##### 5. Добавьте еще один файл в папку data на хостовой машине

В папку `data` на хосте добавлен файл `host.txt` с содержимым: 
> Привет с хоста! 

##### 6. Подключитесь к контейнеру second_node с помощью exec и получите список файлов в директории /var/second/data, выведете на экран содержимое файлов

Команда подключения: `docker exec -it second_node /bin/sh`
Далее команды в терминале sh: 
``` 
# cd var/second/data
# ls 
first_node.txt  host.txt
# cat *
Hello from first_node!
Привет с хоста! #
```

##### 7. Остановите оба контейнера

Остановка контейнеров:
`docker stop first_node`
`docker stop second_node`

##### 8. Удалите оба контейнера

Удаление контейнеров:
`docker rm first_node`
`docker rm second_node`

##### 9. Удалите образ node версии 15.14

Удаление образа: `docker rmi node:15.14`
Результат: 
> Untagged: node:15.14
Untagged: node@sha256:608bba799613b1ebf754034ae008849ba51e88b23271412427b76d60ae0d0627
Deleted: sha256:3d3f41722daf1a77c34d6eade6676bbffa2d6a2a21095de2ab0c427a5c942fc9
Deleted: sha256:601382991a159cfc5013ad973158f30b7b7a913e8d7e547b3456deab3ad98022
Deleted: sha256:d5db49eecae8c02c9ea3a79f89c43ded9162bac118a0302a7b514d0df82aa112
Deleted: sha256:a2c1973858d0aad3de0927294602b17c8ef9050c30e0f461e0868997a08552a4
Deleted: sha256:a0153172017a08a521a8be971ca4dcb5fbc4b7227642c12bbb2da6265bd66b50
Deleted: sha256:f1123940e954d335d91b52a40fab4f8144f38ff113ade7d65663071d0f06da6f
Deleted: sha256:f1f4fbb0e7e6e0ce2d9eae1e577f9f6df0a719dd874bff00b2d08895c75c297d
Deleted: sha256:1eb455ab6d45fdbbd90fccff791ffa228080c052acf464f8da1b1d78650bd706
Deleted: sha256:1dbe832a694971a925d7d216f49b700c95f402bd72288f9d37eceb1d59dcf72d
Deleted: sha256:2f4ee6a2e1b5dfb9236cd262e788f9d39109242ca27a4aacb583c8af66ec3ff7