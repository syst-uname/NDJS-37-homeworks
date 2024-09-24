// Скрипт для начальной инициализации базы данных
// запускает один раз при старте контейнера 
const book1 = {
  id: 1,
  title: 'Война и мир',
  authors: 'Лев Николаевич Толстой',
  description:
    'Роман-эпопея Льва Николаевича Толстого, описывающий русское общество в эпоху войн ' +
    'против Наполеона в 1805—1812 годах. Эпилог романа доводит повествование до 1820 года.',
  favorite: 100,
  fileNameCover: 'Лев Николаевич Толстой - Война и мир.jpg',
  fileOriginalCover: 'Война и мир.jpg',
  fileNameBook: 'Лев Николаевич Толстой - Война и мир.txt',
  fileOriginalBook: 'Война и мир.txt'
}

const book2 = {
  id: 2,
  title: 'JavaScript для чайников',
  authors: 'Крис Минник и Ева Холланд',
  description:
    'JavaScript - это ключевой инструмент для создания современных веб-сайтов, ' +
    'и с помощью этой книги, ориентированной на новичков, ' +
    'вы сможете выучить язык в короткие сроки с минимальными усилиями.',
  favorite: 70,
  fileNameCover: 'Крис Минник и Ева Холланд - JavaScript для чайников.jpg',
  fileOriginalCover: 'JavaScript для чайников.jpg',
  fileNameBook: 'Крис Минник и Ева Холланд - JavaScript для чайников.txt',
  fileOriginalBook: 'JavaScript для чайников.txt'
}

const book3 = {
  id: 3,
  title: 'Туда и обратно',
  authors: 'Джон Р. Р. Толкин',
  description:
    'Путешествие хоббита Бильбо Бэггинса, волшебника Гэндальфа ' +
    'и тринадцати гномов во главе с Торином Дубощитом',
  favorite: 60,
  fileNameCover: 'Джон Р. Р. Толкин - Туда и обратно.jpg',
  fileOriginalCover: 'Туда и обратно.jpg',
  fileNameBook: 'Джон Р. Р. Толкин - Туда и обратно.fb2',
  fileOriginalBook: 'Туда и обратно.fb2'
}

// при создании новой книги 
const book4 = {
  id: 4,
  title: 'Государство',
  authors: 'Платон',
  description:
    'Диалог Платона, посвящённый проблеме идеального государства. ' +
    'Написан в 360 г. до н. э. С точки зрения Платона, государство ' +
    'является выражением идеи справедливости. В диалоге впервые отчётливо ' +
    'определяются философы как люди, способные постичь то, что вечно тождественно самому себе (идея).',
  favorite: 10,
  fileNameCover: 'Платон - Государство.jpg',
  fileOriginalCover: 'Государство.jpg',
  fileNameBook: 'Платон - Государство.txt',
  fileOriginalBook: 'Государство.txt'
}

db.createCollection("books");
db.books.insertMany([book1, book2, book3, book4]);


// Пользователи 
const user1 = {
  username: 'JD',
  fullname: 'John Doe',
  email: 'JohnDoe@gmail.com',
  password: '$2b$10$jQleZK2mzlhCxJE2076dZOQtB9OCDo8j3.MsajDRN5W5eXFNqpv0e',   // JD
  created: new Date(),
}

const user2 = {
  username: 'BadComedian',
  fullname: 'Евгений Баженов',
  email: 'BadComedian@mail.ru',
  password: '$2b$10$ZXht5NGvXJhPb6Ae7YUgfO559tE2kEnUimEVSYjvaOf7zkIlYa.wS',   // BadComedian
  created: new Date(),
}

const user3 = {
  username: 'Admin',
  fullname: 'Администратор',
  email: 'admin@library.ru',
  password: '$2b$10$1K6MrVhv1Ivn/aNLk3s2tepCL2Z14xQHuLFwbcntl.PomQa626IIa',   // Admin
  created: new Date(),
}

db.createCollection("users");
db.users.insertMany([user1, user2, user3]);

// Комментарии 
db.createCollection("comments");
db.comments.insertMany([
  // комментарии к самой библиотеке
  { parent: 'index', username: 'JD', text: 'Первый!', created: new Date() },
  { parent: 'index', username: 'Admin', text: 'Рады приветствовать всех читаталей в нашей библиотеке', created: new Date() },
  { parent: 'index', username: 'BadComedian', text: 'Хороший выбор', created: new Date() },
  { parent: 'index', username: 'BadComedian', text: 'Всем спасибо!', created: new Date() },
  // комментарии к книгам 
  { parent: '1', username: 'Admin', text: 'Предоставлен свободный доступ к книге', created: new Date() },
  { parent: '1', username: 'BadComedian', text: 'Книга имеет огромное культурное и социальное влияние, отражая ключевые моменты истории России и мировой политики.', created: new Date() },
  { parent: '1', username: 'JD', text: 'Не смог дочитать', created: new Date() },
  { parent: '1', username: 'JD', text: 'Но очень интересно', created: new Date() },
]);

