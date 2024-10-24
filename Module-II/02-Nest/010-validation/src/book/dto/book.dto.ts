import { IsDefined, IsInt, IsPositive, IsString, MaxLength, MinLength } from 'class-validator'
import { IBook } from '../interfaces/book.interface'

export class CreateBookDto {

  @IsInt()
  @IsPositive()
  @IsDefined()
  public readonly id: IBook['id']

  @IsString()
  @MaxLength(15)
  @IsDefined()
  public readonly title: IBook['title']

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsDefined()
  public readonly authors: IBook['authors']

  @IsString()
  public readonly description: IBook['description']
}

export class UpdateBookDto {
  description: IBook['description']
}
