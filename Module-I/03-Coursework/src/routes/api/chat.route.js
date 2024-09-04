import { Router } from 'express'

import { authenticateUser } from '../../middleware/index.js'
import { ChatService } from '../../services/index.js'

const router = Router()

// получить чат между пользователями
router.get('/',
  authenticateUser,
  async (req, res) => {
    try {
      const chat = await ChatService.find(req.query.users)
      res.status(200).json({
        data: chat,
        status: 'ok',
      })
    } catch (error) {
      res.status(error.status).json({
        error: error.message,
        status: 'error',
      })
    }
  }
)

// история чата по id 
router.get('/getHistory/:id',
  authenticateUser,
  async (req, res) => {
    try {
      const chat = await ChatService.getHistory(req.params.id)
      res.status(200).json({
        data: chat,
        status: 'ok',
      })
    } catch (error) {
      res.status(error.status).json({
        error: error.message,
        status: 'error',
      })
    }
  }
)


// отправка сообщения
router.post('/',
  authenticateUser,
  async (req, res) => {
    try {
      const message = await ChatService.sendMessage(req.body, req.user)
      res.status(200).json({
        data: message,
        status: 'ok',
      })
    } catch (error) {
      res.status(error.status).json({
        error: error.message,
        status: 'error',
      })
    }
  }
)

export default router