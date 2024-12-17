import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SupportRequestService } from './support-request.service'
import { SupportRequestController } from './support-request.controller'
import { Message, MessageSchema, SupportRequest, SupportRequestSchema } from './schemas'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [SupportRequestController],
  providers: [SupportRequestService],
})
export class SupportRequestModule {}
