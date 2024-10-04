import express from 'express'
import * as redis from 'redis'

const app = express()

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const client = redis.createClient({ url: REDIS_URL });
(async () => await client.connect())()

// увеличение счетчика
app.post('/counter/:bookId/incr', async (req, res) => {
    try {
        const count = await client.incr(req.params.bookId)
        res.json({ count })
    } catch (error) {
        res.json({ code: 500, message: `redis error: ${error}` })
    }
})

// получение значения счетчика
app.get('/counter/:bookId', async (req, res) => {
    try {
        const count = await client.get(req.params.bookId) || 0
        res.json({ count })
    } catch (error) {
        res.json({ code: 500, message: `redis error: ${error}` })
    }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Приложение counter запущено на порту ${PORT}`))