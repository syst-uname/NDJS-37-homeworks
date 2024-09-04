import path from 'path'
import fs from 'fs'

import config from '../config/index.js'
import { AdvertisementModel } from '../models/index.js'
import { HttpException } from '../exceptions/index.js'

class AdvertisementService {

  async create(req) {
    try {
      const ad = new AdvertisementModel({
        shortText: req.body.shortText,
        description: req.body.description,
        userId: req.user._id,
        tags: req.body.tags ?
          Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map(t => t.trim())
          : [],
      })

      // папка с id объявления, если есть файлы 
      if (req.files.length) {
        const adDir = path.join(config.server.uploadsDir, ad._id.toString())
        fs.mkdirSync(adDir, { recursive: true });

        // перемещение загруженных файлов из /uploads в папку с id объявления
        req.files.forEach(file => {
          fs.renameSync(
            path.join(config.server.uploadsDir, file.originalname),
            path.join(adDir, file.originalname)
          )
        })

        // имена загруженных файлов
        ad.images = req.files.map(file => path.join(adDir, file.originalname))
      }

      await ad.save()
      return this.get(ad._id)
    } catch (error) {
      throw new HttpException(500, `Ошибка при создании объявления: ${error.message}`)
    }
  }

  async get(id) {
    try {
      const ad = await AdvertisementModel
        .findById(id)
        .populate('userId', { name: 1 })
        .lean()
      if (!ad) {
        throw new HttpException(404, `объявление не найдено`)
      }
      if (ad.isDeleted) {
        throw new HttpException(410, `объявление удалено`)
      }
      return this.mapFields(ad)
    } catch (error) {
      throw new HttpException(error.status || 500, `Ошибка при получении объявления ${id}: ${error.message}`)
    }
  }

  async find(params) {
    try {
      const conditions = {}

      if (params.userId) {
        conditions.userId = params.userId
      }
      if (params.shortText) {
        conditions.shortText = new RegExp(params.shortText, 'i')
      }
      if (params.description) {
        conditions.description = new RegExp(params.description, 'i')
      }
      if (params.tags) {
        const tagsArray = Array.isArray(params.tags) ? params.tags : params.tags.split(',')
        conditions.tags = { $all: tagsArray }
      }

      const ads = await AdvertisementModel
        .find(conditions)
        .populate('userId', { name: 1 })
      const data = ads
        .filter(ad => !ad.isDeleted)
        .map(ad => this.mapFields(ad))
      return data
    } catch (error) {
      throw new HttpException(500, `Ошибка при поиске объявлений: ${error.message}`)
    }
  }

  // поля объявления к выходному виду 
  mapFields = (ad) => ({
    _id: ad._id,
    shortText: ad.shortText,
    description: ad.description,
    images: ad.images,
    user: ad.userId,
    createdAt: ad.createdAt,
    updatedAt: ad.updatedAt,
    tags: ad.tags,
  })

  async delete(id, user) {
    try {
      const ad = await AdvertisementModel
        .findById(id)
        .populate('userId', { email: 1 })
      if (!ad) {
        throw new HttpException(404, `объявление не найдено`)
      }
      if (ad.isDeleted) {
        throw new HttpException(410, `объявление уже удалено`)
      }
      if (ad.userId.email !== user.email) {
        throw new HttpException(403, `недостаточно прав`)
      }
      ad.isDeleted = true
      await ad.save()
    } catch (error) {
      throw new HttpException(error.status || 500, `Ошибка при удалении объявления ${id}: ${error.message}`)
    }
  }
}

export default new AdvertisementService()