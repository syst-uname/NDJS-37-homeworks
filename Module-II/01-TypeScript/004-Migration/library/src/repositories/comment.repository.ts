import CommentModel from '../models/comment.model.js'
import CustomError from '../errors/custom.error.js'
import container from '../config/container.js'
import { UserRepository } from './index.js'

class CommentRepository {

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
            const userRepository = container.get(UserRepository)
            return {
                ...comment,
                user: await userRepository.find(comment.username)
            }
        } catch (error) {
            throw new CustomError(`Ошибка при получении комментариев пользователя ${comment.username}: ${error.message}`, 500)
        }
    }

}

export default CommentRepository