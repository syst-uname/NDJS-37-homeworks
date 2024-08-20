import library from "../model/library.js"

const error404 = (req, res) => {
  res.render('errors/404', {
    title: 'Ошибка 404. Страница не найдена',
    books: library.getAll()
  })
}

export default error404