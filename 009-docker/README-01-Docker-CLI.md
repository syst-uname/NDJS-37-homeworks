### Задание 1 - Docker CLI

ОС Windows 11, терминал cmd.exe 

##### 1. Загрузите образ busybox последней версии

Команда: `docker pull busybox`

Результат: 
> Using default tag: latest
latest: Pulling from library/busybox
ec562eabd705: Pull complete
Digest: sha256:9ae97d36d26566ff84e8893c64a6dc4fe8ca6d1144bf5b87b2b85a32def253c7
Status: Downloaded newer image for busybox:latest
docker.io/library/busybox:latest
>
>What's Next?
>  1. Sign in to your Docker account → docker login
>  2. View a summary of image vulnerabilities and recommendations → docker scout quickview busybox


Вывод список всех образов после установки busybox: `docker images`

Результат: 
|REPOSITORY|TAG|IMAGE ID|CREATED|SIZE|
|-|-|-|-|-|
|busybox      |latest    |65ad0d468eb1   |14 months ago   |4.26MB|
 

##### 2. Запустите новый контейнер busybox с командой ping сайта netology.ru, и количеством пингов 7, поименуйте контейнер pinger

Команда: `docker run --name pinger -it busybox ping -c 7 netology.ru`

Результат: 
> PING netology.ru (188.114.99.224): 56 data bytes
64 bytes from 188.114.99.224: seq=0 ttl=63 time=521.313 ms
64 bytes from 188.114.99.224: seq=1 ttl=63 time=517.852 ms
64 bytes from 188.114.99.224: seq=2 ttl=63 time=142.186 ms
64 bytes from 188.114.99.224: seq=3 ttl=63 time=93.618 ms
64 bytes from 188.114.99.224: seq=4 ttl=63 time=92.383 ms
64 bytes from 188.114.99.224: seq=5 ttl=63 time=136.275 ms
64 bytes from 188.114.99.224: seq=6 ttl=63 time=333.096 ms
>
> --- netology.ru ping statistics ---
7 packets transmitted, 7 packets received, 0% packet loss
round-trip min/avg/max = 92.383/262.389/521.313 ms


##### 3. Выведите на список всех контейнеров - запущенных и остановленных

Команда: `docker ps -a`

Результат: 
|CONTAINER ID|IMAGE|COMMAND|CREATED|STATUS|PORTS|NAMES|
|-|-|-|-|-|-|-|
|ecdd982b0974   |busybox   |"ping -c 7 netology.…"   |5 minutes ago   |Exited (0) 5 minutes ago             ||pinger 

##### 4. Выведите на экран логи контейнера с именем pinger

Команда: `docker logs pinger` 

Результат: 
> PING netology.ru (188.114.99.224): 56 data bytes
64 bytes from 188.114.99.224: seq=0 ttl=63 time=521.313 ms
64 bytes from 188.114.99.224: seq=1 ttl=63 time=517.852 ms
64 bytes from 188.114.99.224: seq=2 ttl=63 time=142.186 ms
64 bytes from 188.114.99.224: seq=3 ttl=63 time=93.618 ms
64 bytes from 188.114.99.224: seq=4 ttl=63 time=92.383 ms
64 bytes from 188.114.99.224: seq=5 ttl=63 time=136.275 ms
64 bytes from 188.114.99.224: seq=6 ttl=63 time=333.096 ms
> 
> --- netology.ru ping statistics ---
7 packets transmitted, 7 packets received, 0% packet loss
round-trip min/avg/max = 92.383/262.389/521.313 ms

##### 5. Запустите второй раз контейнера с именем pinger

Запуск существующего контейнера: `docker start pinger`

##### 6. Выведите на список всех контейнеров - запущенных и остановленных

Команда: `docker ps -a`

Результат: 
|CONTAINER ID|IMAGE|COMMAND|CREATED|STATUS|PORTS|NAMES|
|-|-|-|-|-|-|-|
|ecdd982b0974   |busybox   |"ping -c 7 netology.…"   |20 minutes ago   |Exited (0) 22 seconds ago             ||pinger 


##### 7. Выведите на экран логи контейнера с именем pinger

Команда: `docker logs pinger` 

Результат: 
> PING netology.ru (188.114.99.224): 56 data bytes
64 bytes from 188.114.99.224: seq=0 ttl=63 time=521.313 ms
64 bytes from 188.114.99.224: seq=1 ttl=63 time=517.852 ms
64 bytes from 188.114.99.224: seq=2 ttl=63 time=142.186 ms
64 bytes from 188.114.99.224: seq=3 ttl=63 time=93.618 ms
64 bytes from 188.114.99.224: seq=4 ttl=63 time=92.383 ms
64 bytes from 188.114.99.224: seq=5 ttl=63 time=136.275 ms
64 bytes from 188.114.99.224: seq=6 ttl=63 time=333.096 ms
>
>--- netology.ru ping statistics ---
7 packets transmitted, 7 packets received, 0% packet loss
round-trip min/avg/max = 92.383/262.389/521.313 ms
PING netology.ru (188.114.99.224): 56 data bytes
64 bytes from 188.114.99.224: seq=0 ttl=63 time=82.276 ms
64 bytes from 188.114.99.224: seq=1 ttl=63 time=105.695 ms
64 bytes from 188.114.99.224: seq=2 ttl=63 time=59.652 ms
64 bytes from 188.114.99.224: seq=3 ttl=63 time=243.628 ms
64 bytes from 188.114.99.224: seq=4 ttl=63 time=194.491 ms
64 bytes from 188.114.99.224: seq=5 ttl=63 time=65.323 ms
64 bytes from 188.114.99.224: seq=6 ttl=63 time=79.160 ms
>
> --- netology.ru ping statistics ---
7 packets transmitted, 7 packets received, 0% packet loss
round-trip min/avg/max = 59.652/118.603/243.628 ms

##### 8. Определите по логам общее количество запусков команды ping и какое общее количество отправленых запросов

Выходит, при повторном запуске контейнера pinger, снова отрабатывает команда COMMAND которая еще раз вызывает ping до netology.ru даже без конкретного указания самой команды. Значит, общее количество запусков ping равно 2, а количество запросов равно 14. 

##### 9. Удалите контейнер с именем pinger

Команда: `docker rm pinger`
Результат: 
> pinger 

Список всех контейнеров после удаления: `docker ps -a`
|CONTAINER ID|IMAGE|COMMAND|CREATED|STATUS|PORTS|NAMES|
|-|-|-|-|-|-|-|
|

##### 10. Удалите образ busybox 
 
Команда: `docker rmi busybox`
Результат: 
> Untagged: busybox:latest
Untagged: busybox@sha256:9ae97d36d26566ff84e8893c64a6dc4fe8ca6d1144bf5b87b2b85a32def253c7
Deleted: sha256:65ad0d468eb1c558bf7f4e64e790f586e9eda649ee9f130cd0e835b292bbc5ac
Deleted: sha256:d51af96cf93e225825efd484ea457f867cb2b967f7415b9a3b7e65a2f803838a

Список всех образов: `docker images`
|REPOSITORY|TAG|IMAGE ID|CREATED|SIZE|
|-|-|-|-|-|
|