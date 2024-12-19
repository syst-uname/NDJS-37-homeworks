import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SupportRequestController } from './support-request.controller'
import { SupportRequestClientService, SupportRequestEmployeeService, SupportRequestService } from './services'
import { SupportRequest, SupportRequestSchema } from './schemas'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SupportRequest.name, schema: SupportRequestSchema }]),
  ],
  controllers: [SupportRequestController],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class SupportRequestModule {}
