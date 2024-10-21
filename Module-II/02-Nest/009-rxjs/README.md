### Потоки RxJS

Реализация в основном сервисе `AppService` приложения.  
С помощью RxJS происходит обращение к общедоступным API GitHub и GitHub.  
В результате работы выводятся название и описание для первых 5 возвращаемых каждым ресурсом элементов.

#### Тестирование
##### Успешный поиск 

Поиск по тексту "rxjs"

Запрос `GET` на `http://localhost:3000/search?query=rxjs`  
Ответ:
```
{
    "github": [
        {
            "name": "rxjs",
            "description": "A reactive programming library for JavaScript"
        },
        {
            "name": "RxJS",
            "description": "The Reactive Extensions for JavaScript"
        },
        {
            "name": "rxjs-course",
            "description": "RxJs In Practice Course - https://angular-university.io/course/rxjs-course"
        },
        {
            "name": "learn-rxjs",
            "description": "Clear examples, explanations, and resources for RxJS"
        },
        {
            "name": "angular2-rxjs-chat",
            "description": "Example Chat Application using RxJS and Angular 2"
        }
    ],
    "gitlab": [
        {
            "name": "Angular RxJS",
            "description": null
        },
        {
            "name": "test-task-fsd-rxjs",
            "description": null
        },
        {
            "name": "ng-master-detail",
            "description": "A simple implementation of a Responsive Master-Detail Component using Angular 8, RxJs, NGRX, SCSS and typescript"
        },
        {
            "name": "Rxjs-Operators",
            "description": null
        },
        {
            "name": "rxjs",
            "description": null
        }
    ]
}
```

##### Данные отсутствуют 

Поиск по тексту "invalid123"

Запрос `GET` на `http://localhost:3000/search?query=invalid123`  
Ответ:
```
{
    "github": [
        {
            "name": "invalid123400",
            "description": "A website for user WrXQTd7b84Or32jLMsZqvoG5KH42"
        }
    ],
    "gitlab": []
}
```

##### Ошибка доступа

В коде, в url для обращения к github специально допущена ошибка (текст ERROR)

Запрос `GET` на `http://localhost:3000/search?query=текст`  
Ответ:
```
{
    "github": {
        "error": "Ошибка при запросе https://api.github.com.ERROR/search/repositories?q=текст: getaddrinfo ENOTFOUND api.github.com.error"
    },
    "gitlab": [
        {
            "name": "TimeTracker",
            "description": "Консольная утилита для отслеживания активностей. Позволяет вводить пользовательские активности, регистрировать их длительность, генерировать отчеты об использовании времени. Включает управление активностями, таймеры, текстовые отчеты, визуализацию в терминале, настройку параметров. Для продуктивного распределения времени"
        },
        {
            "name": "Автоматическая обработка текстов и Обработка изображений",
            "description": null
        },
        {
            "name": "Отчистка текста от ссылок",
            "description": null
        },
        {
            "name": "discounts-finder",
            "description": "Сервис, анализирующий транскрибированные тексты телефонных разговоров с целью распознавания упоминаний скидок и их размеров"
        },
        {
            "name": "Journal-Students-console-program",
            "description": "Программа записывающая информацию о учениках в текстовый файл."
        }
    ]
}
```
