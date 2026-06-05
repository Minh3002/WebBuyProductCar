import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OAuth2Client } from 'google-auth-library';
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
  private model: any;

  constructor(
    private configService: ConfigService,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {
    // Đọc API Key (dạng OAuth token AQ.Ab8RN...)
    const apiKey = process.env.GEMINI_API_KEY?.trim() || '';
    
    console.log("TOKEN OAUTH LOCAL NHẬN ĐƯỢC LÀ:", apiKey);
    
    if (!apiKey) {
      console.error("CẢNH BÁO: Chưa cấu hình GEMINI_API_KEY!");
    }

    // Khởi tạo thư viện xác thực Google OAuth Auth Library
    const authClient = new OAuth2Client();
    authClient.setCredentials({ access_token: apiKey });

    // Cấu hình fetch custom để đính kèm Bearer token vào Headers
    const customFetch = async (url: string, init?: any) => {
      const headers = await authClient.getRequestHeaders() as any;
      const customHeaders = new Headers(init.headers);
      
      // Bỏ API Key kiểu cũ để Google hiểu đây là OAuth
      customHeaders.delete('x-goog-api-key');
      customHeaders.set('Authorization', headers.Authorization || headers['Authorization']);
      
      return fetch(url, { ...init, headers: customHeaders });
    };

    // Khởi tạo SDK với Dummy Key và nhét custom fetch OAuth vào Request Options
    this.genAI = new GoogleGenerativeAI('DUMMY_KEY_FOR_OAUTH');
    
    // Khởi tạo model với cấu hình OAuth Override
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Bạn là trợ lý chuyên gia phụ tùng ô tô thông minh của hệ thống Mazlay Parts. Hãy sử dụng công cụ tìm kiếm Google tích hợp để tra cứu thông tin kỹ thuật, mã OEM, thông số đời xe và giá cả phụ tùng mới nhất trên Internet, sau đó tổng hợp lại thành câu trả lời ngắn gọn, chính xác bằng tiếng Việt.",
      tools: [productSearchTool as any, { googleSearch: {} } as any]
    }, { fetch: customFetch as any });
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
    if (!this.genAI || !this.model) {
      return "Hệ thống AI hiện đang bảo trì hoặc chưa cấu hình API_KEY. Vui lòng liên hệ Admin.";
    }

    try {
      let formattedHistory: any[] = [];
      let lastRole = '';

      for (const msg of history) {
        const role = msg.role === 'user' ? 'user' : 'model';
        // Bỏ qua tin nhắn model nếu lịch sử đang rỗng (Gemini bắt buộc tin nhắn đầu tiên phải là user)
        if (role === 'model' && formattedHistory.length === 0) {
          continue;
        }
        
        // Đảm bảo các role xen kẽ nhau
        if (role !== lastRole) {
          formattedHistory.push({
            role: role,
            parts: [{ text: msg.text || '...' }]
          });
          lastRole = role;
        } else {
          // Nếu trùng role với tin nhắn trước, gộp text lại
          formattedHistory[formattedHistory.length - 1].parts[0].text += '\n' + (msg.text || '...');
        }
      }

      const chat = this.model.startChat({
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
    } catch (error: any) {
      console.error("LỖI HỆ THỐNG AI CHI TIẾT:", error);
      return `Xin lỗi, hiện tại tôi gặp khó khăn khi kết nối. Vui lòng thử lại sau ít phút.\n(Chi tiết lỗi hệ thống: ${error?.message || 'Lỗi không xác định'})`;
    }
  }
}
