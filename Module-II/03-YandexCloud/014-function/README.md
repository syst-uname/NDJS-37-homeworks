### Yandex Cloud Functions

##### Реализация

Создана Cloud Functions и API Gateway для нее. Созданному шлюзу был выдан адрес https://d5dk0e2hi64mt0gce78t.apigw.yandexcloud.net    

Была попытка использования Managed Service for MongoDB, но при создании кластера MongoDB был озвучен счет в 7 618,10 ₽ в месяц. Кажется пробный грант здесь не сможет помочь. На этом попытки использования MongoDB закончились. Поэтому данные персонажей считываются с помощью ресурса https://b2816a0c6b23347d.mokky.dev/characters из предыдущего задания.  

##### Тестирование 
###### Получить всех персонажей 

Запрос по адресу https://d5dk0e2hi64mt0gce78t.apigw.yandexcloud.net/api/characters 

Результат (данные обрезаны для удобства): 
```
[
  {
    "id": 1009610,
    "name": "Человек-паук",
    "nameor": "Spider-Man",
    "description": "Укушенный радиоактивным пауком, старшеклассник Питер Паркер обрел скорость, силу и силу паука. Приняв имя Человек-паук, Питер надеялся начать карьеру, используя свои новые способности. Наученный тому, что с большой силой приходит большая ответственность, Паук поклялся использовать свои силы, чтобы помогать людям.",
    "modified": "2020-07-21T10:30:10-0400",
    "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b.jpg",
    "comics": [
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/62304",
        "name": "Spider-Man: 101 Ways to End the Clone Saga (1997) #1"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/78503",
        "name": "2099 Alpha (2019) #1"
      },
      ...
    ]
  },
  {
    "id": 1009718,
    "name": "Россомаха",
    "nameor": "Wolverine",
    "description": "Рожденный со сверхчеловеческими чувствами и способностью исцелять практически от любой раны, Росомаха был захвачен тайной канадской организацией и получил нерушимый скелет и когти. С ним обращались как с животным, и ему потребовались годы, чтобы взять себя в руки. Теперь он является премьером как 'Людей Икс', так и 'Мстителей'.",
    "modified": "2016-05-02T12:21:44-0400",
    "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/2/60/537bcaef0f6cf.jpg",
    "comics": [
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/41113",
        "name": "5 Ronin (Hardcover)"
      },
      ...
    ],
  },
  {
    "id": 1009368,
    "name": "Железный человек",
    "nameor": "Iron Man",
    "description": "Раненый, захваченный в плен и вынужденный создавать оружие своими врагами, миллиардер-промышленник Тони Старк вместо этого создал усовершенствованный доспех, чтобы спасти свою жизнь и сбежать из плена. Теперь, с новым взглядом на жизнь, Тони использует свои деньги и интеллект, чтобы сделать мир более безопасным и лучшим местом в качестве Железного Человека.",
    "modified": "2016-09-28T12:08:19-0400",
    "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg",
    "comics": [
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/43495",
        "name": "A+X (2012) #2"
      },
     ...
    ]
  },
  ...
```


###### Получить персонажа по ID

Запрос по адресу https://d5dk0e2hi64mt0gce78t.apigw.yandexcloud.net/api/characters?id=1009718 где ID `1009718` соответствует персонажу `Россомаха`

Результат: 
```
[
  {
    "id": 1009718,
    "name": "Россомаха",
    "nameor": "Wolverine",
    "description": "Рожденный со сверхчеловеческими чувствами и способностью исцелять практически от любой раны, Росомаха был захвачен тайной канадской организацией и получил нерушимый скелет и когти. С ним обращались как с животным, и ему потребовались годы, чтобы взять себя в руки. Теперь он является премьером как 'Людей Икс', так и 'Мстителей'.",
    "modified": "2016-05-02T12:21:44-0400",
    "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/2/60/537bcaef0f6cf.jpg",
    "comics": [
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/41113",
        "name": "5 Ronin (Hardcover)"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/38756",
        "name": "5 Ronin (2010) #1"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/36162",
        "name": "5 Ronin (2010) #1"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/43488",
        "name": "A+X (2012) #1"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/43501",
        "name": "A+X (2012) #4"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/43505",
        "name": "A+X (2012) #6"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/43508",
        "name": "A+X (2012) #9"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/78497",
        "name": "Acts Of Evil (Trade Paperback)"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/29317",
        "name": "ACTS OF VENGEANCE CROSSOVERS OMNIBUS (Hardcover)"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/29318",
        "name": "ACTS OF VENGEANCE CROSSOVERS OMNIBUS (DM Only) (Hardcover)"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/37996",
        "name": "Age of X: Alpha (2010) #1"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/24017",
        "name": "Agents of Atlas (2009) #3 (Wolverine Art Appreciation Variant)"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/24221",
        "name": "Agents of Atlas (2009) #5"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/24222",
        "name": "Agents of Atlas (2009) #5 (MCGUINNESS VARIANT)"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/66661",
        "name": "Agents of Atlas: The Complete Collection Vol. 1 (Trade Paperback)"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/62094",
        "name": "All-New Wolverine Vol. 5: Orphans of X (Trade Paperback)"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/43467",
        "name": "All-New X-Men (2012) #2"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/12690",
        "name": "Alpha Flight (1983) #3"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/38564",
        "name": "Alpha Flight (2011) #7"
      },
      {
        "resourceURI": "http://gateway.marvel.com/v1/public/comics/12671",
        "name": "Alpha Flight (1983) #13"
      }
    ],
    "urls": [
      {
        "type": "detail",
        "url": "http://marvel.com/comics/characters/1009718/wolverine?utm_campaign=apiRef&utm_source=aa6d39bfec93d0dc513c53c6cfb66853"
      },
      {
        "type": "wiki",
        "url": "http://marvel.com/universe/Wolverine_(James_Howlett)?utm_campaign=apiRef&utm_source=aa6d39bfec93d0dc513c53c6cfb66853"
      },
      {
        "type": "comiclink",
        "url": "http://marvel.com/comics/characters/1009718/wolverine?utm_campaign=apiRef&utm_source=aa6d39bfec93d0dc513c53c6cfb66853"
      }
    ]
  }
]
```
