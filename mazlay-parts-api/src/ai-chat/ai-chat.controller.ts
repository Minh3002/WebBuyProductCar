import { Controller, Post, Body } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';

@Controller('ai/chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post()
  async chat(@Body('message') message: string, @Body('history') history: any[]) {
    const responseText = await this.aiChatService.chat(message, history);
    return { response: responseText };
  }
}
