import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessLog, AccessLogSchema } from './schemas/access-log.schema';
import { AccessLogsService } from './access-logs.service';
import { AccessLogsController } from './access-logs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccessLog.name, schema: AccessLogSchema }]),
  ],
  controllers: [AccessLogsController],
  providers: [AccessLogsService],
  exports: [AccessLogsService],
})
export class AccessLogsModule {}
