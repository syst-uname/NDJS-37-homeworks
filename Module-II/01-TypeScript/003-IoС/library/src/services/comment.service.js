import CommentModel from '../models/comment.model.js';
import CustomError from '../errors/costom.error.js';
import UserService from './user.service.js';

class CommentService {

  async get(parent) {
    try {
      const comments = await CommentModel.find({ parent }).lean()
      const commentsWithUser = await Promise.all(
        comments.map(async comment => await this.addUser(comment))
      )
      return commentsWithUser
    } catch (error) {
      throw new CustomError(`Ошибка при получении комментариев для ${parent}: ${error.message}`, 500)
    }
  }

  async add(parent, username, text) {
    try {
      const comment = new CommentModel({
        parent,
        username,
        text
      })
      const newComment = await comment.save()
      return this.addUser(newComment._doc)
    } catch (error) {
      throw new CustomError(`Ошибка при добавлении комментария для ${parent}: ${error.message}`, 500)
    }
  }

  async addUser(comment) {
    try {
      return {
        ...comment,
        user: await UserService.find(comment.username)
      }
    } catch (error) {
      throw new CustomError(`Ошибка при получении комментариев данных пользователя ${comment.username}: ${error.message}`, 500)
    }
  }

}

export default new CommentService()