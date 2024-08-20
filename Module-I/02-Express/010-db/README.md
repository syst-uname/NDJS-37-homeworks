### База данных и хранение данных

#### Запуск БД 
Создание контейнера с mongoDB: 
```
docker run --name myMongo -d -p 27017:27017 mongo
```

Подключение к контейнеру: 
```
docker exec -it myMongo bash 
```

Подключение к mongoDB: 
```
mongosh
``` 

#### Создание БД 

Создание и подключение к БД (команда вместе с результатом работы): 
```
test> use NDJS-37-010-db
switched to db NDJS-37-010-db
```

Создание коллекции: 
```
NDJS-37-010-db> db.createCollection("books")
{ ok: 1 }
```

#### Вставка данных 

Вставка одной записи:
```
NDJS-37-010-db> db.books.insertOne( { title: "Война и мир", description: "Роман-эпопея", authors: "Лев Николайевич Толстой" } )
{
  acknowledged: true,
  insertedId: ObjectId('66ab205dca5ffdcbfa149f49')
}
```

Вставка нескольких записей:
```
NDJS-37-010-db> db.books.insertMany([ 
  { title: "JavaScript для чайников", description: "Обучение JavaScript", authors: "Крис Минник и Ева Холланд" }, 
  { title: "Туда и обратно", description: "Путешествие хоббита Бильбо Бэггинса", authors: "Джон Р. Р. Толкин" }, 
])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('66ab21e9ca5ffdcbfa149f4b'),
    '1': ObjectId('66ab21e9ca5ffdcbfa149f4c')
  }
}
```

Список всех книг после добавления: 
```
NDJS-37-010-db> db.books.find()
[
  {
    _id: ObjectId('66ab205dca5ffdcbfa149f49'),
    title: 'Война и мир',
    description: 'Роман-эпопея',
    authors: 'Лев Николайевич Толстой'
  },
  {
    _id: ObjectId('66ab21e9ca5ffdcbfa149f4b'),
    title: 'JavaScript для чайников',
    description: 'Обучение JavaScript',
    authors: 'Крис Минник и Ева Холланд'
  },
  {
    _id: ObjectId('66ab21e9ca5ffdcbfa149f4c'),
    title: 'Туда и обратно',
    description: 'Путешествие хоббита Бильбо Бэггинса',
    authors: 'Джон Р. Р. Толкин'
  }
]
```

#### Поиск

Поиск по маске ` и ` в поле `title`
```
NDJS-37-010-db> db.books.find({ title: { $regex: ' и '}})
[
  {
    _id: ObjectId('66ab205dca5ffdcbfa149f49'),
    title: 'Война и мир',
    description: 'Роман-эпопея',
    authors: 'Лев Николайевич Толстой'
  },
  {
    _id: ObjectId('66ab21e9ca5ffdcbfa149f4c'),
    title: 'Туда и обратно',
    description: 'Путешествие хоббита Бильбо Бэггинса',
    authors: 'Джон Р. Р. Толкин'
  }
]
```

#### Редактирование

Редактирования полей description и authors коллекции books по _id записи:
```
NDJS-37-010-db> db.books.updateOne(
  { _id: ObjectId('66ab21e9ca5ffdcbfa149f4b') },
  { $set: { title: 'JavaScript для чайников - новое издание', description: 'Обучение JavaScript на новых примерах' } }
)
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

Список всех книг после обновления: 
```
NDJS-37-010-db> db.books.find()
[
  {
    _id: ObjectId('66ab205dca5ffdcbfa149f49'),
    title: 'Война и мир',
    description: 'Роман-эпопея',
    authors: 'Лев Николайевич Толстой'
  },
  {
    _id: ObjectId('66ab21e9ca5ffdcbfa149f4b'),
    title: 'JavaScript для чайников - новое издание',
    description: 'Обучение JavaScript на новых примерах',
    authors: 'Крис Минник и Ева Холланд'
  },
  {
    _id: ObjectId('66ab21e9ca5ffdcbfa149f4c'),
    title: 'Туда и обратно',
    description: 'Путешествие хоббита Бильбо Бэггинса',
    authors: 'Джон Р. Р. Толкин'
  }
]
```