import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiChatService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async chat(message: string, history: any[] = []): Promise<string> {
    if (!this.genAI) {
      return "Hệ thống AI hiện đang bảo trì hoặc chưa cấu hình API_KEY. Vui lòng liên hệ Admin.";
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: "Bạn là Trợ lý chuyên gia kỹ thuật phụ tùng ô tô cao cấp của Mazlay Parts. Nhiệm vụ của bạn là tư vấn cho khách hàng về việc bảo dưỡng xe, giải thích các thông số kỹ thuật, cách đọc mã OEM, dấu hiệu hỏng hóc và tư vấn thời gian thay thế các loại phụ tùng (má phanh, lọc gió, dầu máy, giảm xóc, bugi...). Hãy trả lời ngắn gọn, chuyên nghiệp, thân thiện bằng tiếng Việt. Nếu khách hỏi các vấn đề ngoài ngành ô tô, hãy lịch sự từ chối và hướng họ quay lại chủ đề phụ tùng xe."
      });

      const formattedHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Lỗi AI Chatbot:", error);
      return "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau ít phút.";
    }
  }
}
