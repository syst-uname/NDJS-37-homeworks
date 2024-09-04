// Пользователи
// _id задается строго потому что в postman есть ссылки на пользователей 
const user1 = {
  _id: ObjectId('66ce2fd1ff15b0a9a9190001'),
  email: 'JohnDoe@gmail.com',
  passwordHash: '$2b$10$jQleZK2mzlhCxJE2076dZOQtB9OCDo8j3.MsajDRN5W5eXFNqpv0e',   // JD
  name: 'John Doe',
  contactPhone: '+7 123 456 78 90',
}

const user2 = {
  _id: ObjectId('66ce2fd1ff15b0a9a9190002'),
  email: 'BadComedian@mail.ru',
  passwordHash: '$2b$10$ZXht5NGvXJhPb6Ae7YUgfO559tE2kEnUimEVSYjvaOf7zkIlYa.wS',   // BadComedian
  name: 'Евгений Баженов',
}

const user3 = {
  _id: ObjectId('66ce2fd1ff15b0a9a9190003'),
  email: 'admin@avito.ru',
  passwordHash: '$2b$10$1K6MrVhv1Ivn/aNLk3s2tepCL2Z14xQHuLFwbcntl.PomQa626IIa',   // Admin
  name: 'Admin',
  contactPhone: '+7 111 222 33 44',
}

db.createCollection('users')
const resultUser1 = db.users.insert(user1)
const resultUser2 = db.users.insert(user2)
const resultUser3 = db.users.insert(user3)

const user1Id = resultUser1.insertedIds['0']
const user2Id = resultUser2.insertedIds['0']


// Объявления
const advertisement1 = {
  _id: ObjectId('66cba528b7e526c34cb00101'),    // тут через свой номер, в storage будет папка с этим id 
  shortText: 'Продажа Лада 2106',
  description:
    'В хорошем состоянии. За машиной ухаживали, все вовремя менялось. ' +
    'Двигатель после кап ремонта проехали 13000. Масло не ест совсем. ' +
    'Пороги меняны, гнили нет. Стоят заводские электроподъемники передних стекол. Музыка.',
  // файлы добавлены заранее 
  images: [
    'src\\storage\\uploads\\66cba528b7e526c34cb00101\\Ваз-2106-двигатель.jpg',
    'src\\storage\\uploads\\66cba528b7e526c34cb00101\\Ваз-2106-кузов.jpg',
    'src\\storage\\uploads\\66cba528b7e526c34cb00101\\Ваз-2106-салон.jpg',
  ],
  userId: user1Id,
  createdAt: new Date(),
  tags: ['Авто', 'Лада', '2106'],
  isDeleted: false,
}

const advertisement2 = {
  _id: ObjectId('66cba528b7e526c34cb00102'),
  shortText: 'Сдается квартира',
  description:
    'Сдается уютная квартира c индивидуальным отоплением. ' +
    'Для проживания есть все необходимое: мебель, техника.' +
    'Рассматриваем платежеспособных, добропорядочных людей без домашних животных.',
  images: [
    'src\\storage\\uploads\\66cba528b7e526c34cb00102\\Кухня.jpg',
    'src\\storage\\uploads\\66cba528b7e526c34cb00102\\Ванная комната.jpg',
  ],
  userId: user2Id,
  createdAt: new Date(),
  tags: ['Квартира', 'Аренда',],
  isDeleted: false,
}

const advertisement3 = {
  _id: ObjectId('66cba528b7e526c34cb00103'),
  shortText: 'Продажа велосипеда',
  description:
    'Продается велосипед GT aggressor comp 27,5 S ' +
    'Гoд покупки: 2019, катались крайне мало, велосипед технически в идеальном состоянии',
  images: [
    'src\\storage\\uploads\\66cba528b7e526c34cb00103\\Ваз-2106-двигатель.jpg',
    'src\\storage\\uploads\\66cba528b7e526c34cb00103\\Ваз-2106-кузов.jpg',
    'src\\storage\\uploads\\66cba528b7e526c34cb00103\\Ваз-2106-салон.jpg',
  ],
  userId: user2Id,
  createdAt: new Date(),
  tags: ['Покатушки', 'GT', '27,5'],
  isDeleted: false,
}

db.createCollection('advertisements')
const resultAdvertisement1 = db.advertisements.insert(advertisement1)
const resultAdvertisement2 = db.advertisements.insert(advertisement2)
const resultAdvertisement3 = db.advertisements.insert(advertisement3)


// Чаты 
const chat1 = {
  _id: ObjectId('66d086d007ef0a7dd6c00301'),
  users: [user1Id, user2Id],
  createdAt: new Date(),
  messages: [
    { _id: ObjectId('66cf7f906931f1a335400201'), author: user1Id, sentAt: new Date(), text: 'Добрый день! Какие тормоза на велосипеде?' },
    { _id: ObjectId('66cf7f906931f1a335400202'), author: user2Id, sentAt: new Date(), text: 'Здравствуйте, гидравлические shimano mt200' },
    { _id: ObjectId('66cf7f906931f1a335400203'), author: user1Id, sentAt: new Date(), text: 'Готов взять со скидкой' },
    { _id: ObjectId('66cf7f906931f1a335400204'), author: user2Id, sentAt: new Date(), text: 'Приходите, обсудим' },
  ]
}

db.createCollection('chats')
const resultChat1 = db.chats.insert(chat1)