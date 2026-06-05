import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';

const productSearchTool = {
  functionDeclarations: [{
    name: 'searchProductsInDatabase',
    description: 'Tìm kiếm sản phẩm phụ tùng ô tô trong kho database theo tên, loại sản phẩm hoặc khoảng giá tối đa',
    parameters: {
      type: 'OBJECT',
      properties: {
        keyword: { type: 'STRING', description: 'Từ khóa tên sản phẩm (ví dụ: cần gạt nước, má phanh)' },
        maxPrice: { type: 'NUMBER', description: 'Mức giá tối đa mà khách hàng yêu cầu (ví dụ: 2000000)' }
      }
    }
  }]
};

@Injectable()
export class AiChatService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async searchProductsInDatabase(keyword?: string, maxPrice?: number) {
    const query: any = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { oem_code: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (maxPrice) {
      query.price = { $lte: maxPrice };
    }
    
    const results = await this.productModel.find(query).limit(5).exec();
    return results.map(p => ({
      title: p.title,
      price: p.price,
      brand: p.brand,
      stock: p.stock_quantity,
      oem_code: p.oem_code
    }));
  }

  async chat(message: string, history: any[] = []): Promise<string> {
    if (!this.genAI) {
      return "Hệ thống AI hiện đang bảo trì hoặc chưa cấu hình API_KEY. Vui lòng liên hệ Admin.";
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: "Bạn là trợ lý chuyên gia phụ tùng ô tô thông minh của hệ thống Mazlay Parts. Hãy sử dụng công cụ tìm kiếm Google tích hợp để tra cứu thông tin kỹ thuật, mã OEM, thông số đời xe và giá cả phụ tùng mới nhất trên Internet, sau đó tổng hợp lại thành câu trả lời ngắn gọn, chính xác bằng tiếng Việt.",
        tools: [productSearchTool as any, { googleSearch: {} } as any],
      });

      const formattedHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      let result = await chat.sendMessage(message);
      
      const functionCalls = result.response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        if (call.name === 'searchProductsInDatabase') {
          const { keyword, maxPrice } = call.args as any;
          const searchResult = await this.searchProductsInDatabase(keyword, maxPrice);
          
          result = await chat.sendMessage([{
            functionResponse: {
              name: 'searchProductsInDatabase',
              response: { content: searchResult }
            }
          }]);
        }
      }

      return result.response.text();
    } catch (error) {
      console.error("Lỗi AI Chatbot:", error);
      return "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau ít phút.";
    }
  }
}
