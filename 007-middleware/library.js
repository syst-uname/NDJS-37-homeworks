import express from 'express'
import config from './config/index.js'
import store from './store.js'


const app = express()
app.use(express.json())

// авторизация
app.post('/api/user/login', (req, res) => {
  res.status(201)
  res.json({ id: 1, mail: "test@mail.ru" })
})

// все книги 
app.get('/api/books', (req, res) => {
  res.json(store.getAll())
})

// конкретная книга
app.get('/api/books/:id', (req, res) => {
  const book = store.get(req.params.id)
  if (book) {
    res.json(book)
  } else {
    res.status(404)
    res.json(`Книга ${req.params.id} не найдена`)
  }
})

// добавление книги
app.post('/api/books/', (req, res) => {
  const book = store.add(req.body)
  if (book) {
    res.json(book)
  } else {
    res.status(404)
    res.json(`Книга не создана`)
  }
})

// редактирование книги
app.put('/api/books/:id', (req, res) => {
  const book = store.update(req.params.id, req.body)
  if (book) {
    res.json(book)
  } else {
    res.status(404)
    res.json(`Книга ${req.params.id} не найдена`)
  }
})

// удаление книги
app.delete('/api/books/:id', (req, res) => {
  if (store.delete(req.params.id)) {
    res.json(`Книга ${req.params.id} удалена`)
  } else {
    res.status(404)
    res.json(`Книга ${req.params.id} не найдена`)
  }
})

app.listen(config.server.port, () => console.log(`Приложение запущено на порту ${config.server.port}`))