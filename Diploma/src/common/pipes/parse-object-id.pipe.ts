import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'

/** Преобразование строки в ObjectId */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'string' || !Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Некорректный ObjectId')
    }
    return new Types.ObjectId(value)
  }
}