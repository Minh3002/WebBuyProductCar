import { Controller, Post, Body } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';

@Controller('chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post('query')
  async query(@Body('message') message: string) {
    return await this.aiChatService.query(message);
  }
}
