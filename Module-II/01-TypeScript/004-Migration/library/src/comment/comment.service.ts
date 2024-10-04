import { container } from '../infrastructure'
import { UserService } from '../user/user.service'
import { CommentModel } from './comment.model'
import { IComment } from './comment.interface'
import { CommentDto } from './comment.dto'
import { HttpException } from '../exceptions'

export class CommentService {

    async get(parent: string): Promise<CommentDto[]> {
        try {
            const comments = await CommentModel.find({ parent }).lean()
            const commentsWithUser = await Promise.all(
                comments.map(async comment => await this.addUser(comment))
            )
            return commentsWithUser
        } catch (error) {
            throw new HttpException(`Ошибка при получении комментариев для ${parent}: ${error.message}`, 500)
        }
    }

    async add(parent: string, username: string, text: string): Promise<CommentDto> {
        try {
            const comment = new CommentModel({
                parent,
                username,
                text
            })
            const newComment = await comment.save()
            return this.addUser(newComment.toObject())
        } catch (error) {
            throw new HttpException(`Ошибка при добавлении комментария для ${parent}: ${error.message}`, 500)
        }
    }

    async addUser(comment: IComment): Promise<CommentDto> {
        try {
            const userService = container.get(UserService)
            return {
                ...comment,
                user: await userService.find(comment.username)
            }
        } catch (error) {
            throw new HttpException(`Ошибка при получении комментариев пользователя ${comment.username}: ${error.message}`, 500)
        }
    }

}