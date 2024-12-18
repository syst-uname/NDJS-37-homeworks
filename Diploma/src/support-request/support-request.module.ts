import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SupportRequestClientService, SupportRequestService } from './services'
import { SupportRequestController } from './support-request.controller'
import { SupportRequest, SupportRequestSchema } from './schemas'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SupportRequest.name, schema: SupportRequestSchema }]),
  ],
  controllers: [SupportRequestController],
  providers: [
    SupportRequestService,
    SupportRequestClientService
  ],
})
export class SupportRequestModule {}
