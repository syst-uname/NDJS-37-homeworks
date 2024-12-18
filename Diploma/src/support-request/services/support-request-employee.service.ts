import { Injectable } from '@nestjs/common'

import { SupportRequestService } from './support-request.service'
import { ISupportRequestEmployeeService } from '../interfaces'

@Injectable()
export class SupportRequestEmployeeService extends SupportRequestService implements ISupportRequestEmployeeService {
}
