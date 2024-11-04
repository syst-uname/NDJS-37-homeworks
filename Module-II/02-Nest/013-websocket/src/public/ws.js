(() => {
  const socket = io.connect('http://localhost:3000')

  // кнопка "Получить комментарии"
  document.getElementById('getAllComments').onclick = () => {
    const bookId = document.getElementById('bookId').value
    socket.emit('getAllComments', { bookId })
  }

  // комментарии от сервера 
  socket.on('bookComments', (data) => {
    const list = document.getElementById('comments')
    data.forEach(item => {
      list.appendChild(document.createElement('li'))
        .textContent = item.comment
    })
  })

  // кнопка "Отправить комментарий"
  document.getElementById('addComment').onclick = () => {
    const bookId = document.getElementById('bookId').value
    const comment = document.getElementById('comment').value

    socket.emit('addComment', {
      bookId,
      comment
    }, (data) => {
      document.getElementById('comments')
        .appendChild(document.createElement('li'))
        .textContent = data.comment
    })
  }

})()