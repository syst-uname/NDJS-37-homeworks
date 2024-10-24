import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class IdValidationPipe implements PipeTransform {

  transform(value: string) {
    const id = Number(value)
    if (isNaN(id)) {
      throw new Error(`Id ${value} не является числом`)
    } else if (id < 0) {
      throw new Error(`Id ${value} не может быть отрицательным`)
    }
    return id
  }
}