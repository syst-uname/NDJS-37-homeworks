const express = require('express')
const serverless = require('serverless-http')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/api/characters', async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString()
    const url = `https://b2816a0c6b23347d.mokky.dev/characters${'?' + queryString}`
    const data = await fetch(url).then(res => res.json())
    res.status(200).json(data)
  } catch (error) {
    console.error('Ошибка:', error.message)
    res.status(500).json({ error: error.message })
  }
})

module.exports.handler = serverless(app)

// app.listen(3000)