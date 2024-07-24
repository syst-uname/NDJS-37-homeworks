### Задание 2 - Environment Variables

##### 1. Загрузите образ node версии 15.14

Команда: `docker pull node:22.5`
Результат: 
```
22.5: Pulling from library/node
ca4e5d672725: Pull complete
30b93c12a9c9: Pull complete
10d643a5fa82: Pull complete
d6dc1019d793: Pull complete
63824f9ef397: Pull complete
50fc95442b3d: Pull complete
9e3b63b7d038: Pull complete
18bb0bf9b4dc: Pull complete
Digest: sha256:4c9ea09651a4939e37b15a4953d9ff8b5a038cfa949c77bb291b792d273b7239
Status: Downloaded newer image for node:22.5
docker.io/library/node:22.5

What's Next?
  View a summary of image vulnerabilities and recommendations → docker scout quickview node:22.5
```

##### 2. Запустите контейнер node в интерактивном режиме подключения терминала, поименуйте его mynode, передайте две переменные среды NAME=<ваше имя> и SURNAME=<ваша фамилия>

Команда: `docker run -it --name mynode -e NAME=Alexander -e SURNAME=Komkov node:22.5`
Результат: 
```
Welcome to Node.js v22.5.1.
Type ".help" for more information.
>
```

##### 3. В интерактивной среде выполнения node выполните скрипт, который выведет на экран приветсвтие: Привет, <ваше имя> <ваша фамилия>!, эти данные должны быть получены из переменных среды

Команда в консоли node: ```> console.log(`Привет, ${process.env.NAME} ${process.env.SURNAME}!`)```
Результат: 
```
Привет, Alexander Komkov!
undefined
>
```

##### 4. Остановите контейнер

Команда: `docker stop mynode`
Результат: 
```
mynode 
```

Список контейнеров: `docker ps -a`
Результат: 
|CONTAINER ID|IMAGE|COMMAND|CREATED|STATUS|PORTS|NAMES|
|-|-|-|-|-|-|-|
|690cee5d386e   |node:22.5   |"docker-entrypoint.s…"   |14 minutes ago   |Exited (137) 9 seconds ago             ||mynode 

##### 5. Удалите образ node версии 15.14

При выполнении: `docker rmi node:22.5`
Получаю ошибку:
``` 
Error response from daemon: conflict: unable to remove repository reference "node:22.5" (must force) - container 690cee5d386e is using its referenced image b966edc80bd3
```

Поэтому сначала удаляют контейнер: `docker rm mynode`
И только после удаляю образ: `docker rmi node:22.5`
 
Результат: 
```
Untagged: node:22.5
Untagged: node@sha256:4c9ea09651a4939e37b15a4953d9ff8b5a038cfa949c77bb291b792d273b7239
Deleted: sha256:b966edc80bd3ac6f33caa225b973225f65aceb35309a20257d38ab0c361a91d7
Deleted: sha256:2ad248b43e952173462a4740b2505beceef7a9bca63b7b09d875cce72e70c474
Deleted: sha256:c9fca4ce0032e46ea853cee7bec711f4d6b940a85ff6220d6c4141e94873310f
Deleted: sha256:c59cafcc9017d663c67540d369f081bebfe620277d36ced56f20ae97ebdba8a1
Deleted: sha256:4d34cae64bc593997118982ca4f6cdff17587f33e05839566aa72575d105a3d7
Deleted: sha256:b14de760057171a137f6a616177db480af066064b9aa5aa1170127f04f5915c6
Deleted: sha256:5dc20d56561ac3440abf47c45e5f2d7636a1ff30966c544227c03e14b32876c4
Deleted: sha256:685c6c0bcc117be33fd6f19b883c9a7dc14285fbeaf4b06cdd52d3d4582ced93
Deleted: sha256:f6faf32734e0870d82ea890737958fe33ce9ddfed27b3b157576d2aadbab3322
```