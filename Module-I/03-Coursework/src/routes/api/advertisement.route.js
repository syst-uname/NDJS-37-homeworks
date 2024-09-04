import { Router } from 'express'

import multer from '../../config/multer.js'
import { authenticateUser } from '../../middleware/index.js'
import { AdvertisementService } from '../../services/index.js'

const router = Router()

// все объявления 
router.get('/', async (req, res) => {
  try {
    const ads = await AdvertisementService.find(req.query)
    res.status(200).json({
      data: ads,
      status: 'ok',
    })
  } catch (error) {
    res.status(error.status).json({
      error: error.message,
      status: 'error',
    })
  }
})

// конкретное объявление
router.get('/:id', async (req, res) => {
  try {
    const ad = await AdvertisementService.get(req.params.id)
    res.status(200).json({
      data: ad,
      status: 'ok',
    })
  } catch (error) {
    res.status(error.status).json({
      error: error.message,
      status: 'error',
    })
  }
})

// добавление объявления
router.post('/',
  authenticateUser,
  multer.array('images'),
  async (req, res) => {
    try {
      const ad = await AdvertisementService.create(req)
      res.status(201).json({
        data: ad,
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

// удаление 
router.delete('/:id',
  authenticateUser,
  async (req, res) => {
    try {
      await AdvertisementService.delete(req.params.id, req.user)
      res.status(200).json({
        message: `Объявление ${req.params.id} удалено`,
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