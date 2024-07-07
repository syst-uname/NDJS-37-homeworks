### Динамическая загрузка данных с API погоды

Использовался API от https://www.worldweatheronline.com/


Ввод: `weather -c Москва`
Результат:  
```
Город: Москва, Россия  
Температура: 25 °C  
```


Ввод: `weather -c Норильск`
Результат:  
```
Город: Норильск, Россия  
Температура: 19 °C  
```


Ввод: `weather -c Tokyo`
Результат:  
```
Город: Tokyo, Japan  
Температура: 28 °C  
```


Ввод: `weather -c invalidCity`
Результат:  
```
Ошибка: Unable to find any matching weather location to the query submitted! 
```
