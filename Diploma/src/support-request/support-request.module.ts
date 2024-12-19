import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SupportRequestClientController, SupportRequestController, SupportRequestManagerController } from './controllers'
import { SupportRequestClientService, SupportRequestEmployeeService, SupportRequestService } from './services'
import { SupportRequest, SupportRequestSchema } from './schemas'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SupportRequest.name, schema: SupportRequestSchema }]),
  ],
  controllers: [
    SupportRequestController,
    SupportRequestClientController,
    SupportRequestManagerController,
  ],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class SupportRequestModule {}
