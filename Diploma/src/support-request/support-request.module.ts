import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SupportRequestController } from './support-request.controller'
import { SupportRequest, SupportRequestSchema } from './schemas'
import { SupportRequestClientService, SupportRequestEmployeeService, SupportRequestService } from './services'
import { SupportRequestGateway } from './support-request.gateway'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SupportRequest.name, schema: SupportRequestSchema }]),
  ],
  controllers: [SupportRequestController],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
    SupportRequestGateway
  ],
})
export class SupportRequestModule {}
