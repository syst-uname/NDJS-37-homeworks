// Скрипт для начальной инициализации базы данных

// Пользователь админ  
const admin = {
  _id: ObjectId('66ce2fd1ff15b0a9a9190001'),
  email: 'admin@mail.ru',
  passwordHash: '$2b$10$A/RgyA0NRQN4xG7r7WWHluEWWn8cj58hGFozDojLcIKGPATQA9dta',   // admin
  name: 'admin',
  contactPhone: '+79000000001',
  role: 'admin',
}

db.createCollection('users')
db.users.insert(admin)