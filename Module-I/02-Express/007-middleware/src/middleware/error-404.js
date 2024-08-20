const error404 = (req, res) => {
  res.status(404)
  res.json('Ошибка 404. Страница не найдена')
}

export default error404