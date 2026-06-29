import { Controller, Get, Query, Delete, Param } from '@nestjs/common';
import { AccessLogsService } from './access-logs.service';

@Controller('admin/access-logs')
export class AccessLogsController {
  constructor(private readonly accessLogsService: AccessLogsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.accessLogsService.findAll(query);
  }

  @Delete('clear-all')
  async clearAll() {
    return this.accessLogsService.clearAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.accessLogsService.remove(id);
  }
}
