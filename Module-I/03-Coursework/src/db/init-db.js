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

