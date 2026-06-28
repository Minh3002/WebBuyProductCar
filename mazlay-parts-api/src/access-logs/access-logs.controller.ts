import { Controller, Get, Query } from '@nestjs/common';
import { AccessLogsService } from './access-logs.service';

@Controller('admin/access-logs')
export class AccessLogsController {
  constructor(private readonly accessLogsService: AccessLogsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.accessLogsService.findAll(query);
  }
}
