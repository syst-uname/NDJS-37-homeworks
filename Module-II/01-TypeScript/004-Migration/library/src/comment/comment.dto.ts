import { UserDto } from '../user/user.dto'
import { IComment } from './comment.interface'

export interface CommentDto extends IComment {
  user: UserDto
}

