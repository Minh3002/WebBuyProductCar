import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiChatService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {
    const apiKey = process.env.GEMINI_API_KEY?.trim() || 'DUMMY_KEY';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async query(message: string): Promise<string> {
    try {
      const apiKey = process.env.GEMINI_API_KEY?.trim() || '';
      
      // Override Fetch để nhét Bearer Token OAuth
      const customFetch = async (url: string, init?: any) => {
        const customHeaders = new Headers(init?.headers);
        customHeaders.delete('x-goog-api-key');
        customHeaders.set('Authorization', `Bearer ${apiKey}`);
        return fetch(url, { ...init, headers: customHeaders });
      };

      // -----------------------------------------------------
      // BƯỚC 1: Phân tích Ý định & Sinh lệnh Mongoose
      // -----------------------------------------------------
      const step1Model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `Bạn là trợ lý hệ thống. Hãy thực hiện 2 bước trong 1 lần phản hồi (JSON):
BƯỚC 1: Phân tích ý định:
- Nếu khách cần tìm hàng, giá, tồn kho -> Trả về JSON: { "is_query": true, "query": {}, "mess": "" }
- Nếu khách chat xã giao -> Trả về JSON: { "is_query": false, "query": {}, "mess": "CÂU_TRẢ_LỜI_XÃ_GIAO" }

BƯỚC 2 (NẾU IS_QUERY = TRUE): 
- Hãy tự tạo lệnh tìm kiếm MongoDB (JSON Object).
Ví dụ: { "title": { "$regex": "má phanh", "$options": "i" }, "price": { "$lte": 2000000 } }
Schema cần lưu ý: { "title": String, "price": Number, "category": String, "stock_quantity": Number, "oem_code": String }

LƯU Ý QUAN TRỌNG:
- Trả về ĐÚNG cấu trúc JSON, không thêm văn bản bọc ngoài.`,
        generationConfig: {
          responseMimeType: "application/json"
        }
      }, { fetch: customFetch as any });

      const step1Result = await step1Model.generateContent(message);
      const step1Text = step1Result.response.text();
      
      let parsed: any;
      try {
        parsed = JSON.parse(step1Text);
      } catch (e) {
        console.error("Lỗi parse JSON Step 1:", step1Text);
        return "Xin lỗi, hệ thống AI đang gặp sự cố khi xử lý dữ liệu. Vui lòng thử lại sau.";
      }

      // Xử lý Xã giao
      if (!parsed.is_query) {
        return parsed.mess || "Chào bạn! Bạn cần hỗ trợ tìm phụ tùng nào ạ?";
      }

      // -----------------------------------------------------
      // BƯỚC 2: Truy vấn Database
      // -----------------------------------------------------
      let rawData = [];
      try {
        const dbQuery = typeof parsed.query === 'string' ? JSON.parse(parsed.query) : parsed.query;
        // Chạy lệnh vào DB
        rawData = await this.productModel.find(dbQuery || {}).limit(5).lean().exec();
      } catch (dbErr) {
        console.error("Lỗi Mongoose Query do AI sinh ra:", parsed.query);
        rawData = [];
      }

      // -----------------------------------------------------
      // BƯỚC 3: Dịch dữ liệu thô (RAW_DATA) thành câu Tư vấn
      // -----------------------------------------------------
      const step2Model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `Bạn là nhân viên bán hàng chuyên nghiệp tại cửa hàng Mazlay Parts. 
Dựa vào USER_MESSAGE và RAW_DATA từ Database, hãy soạn câu trả lời ngắn gọn, thân thiện cho khách. 
Tuyệt đối KHÔNG nhắc đến mã lệnh code hay database. Chỉ tập trung báo giá và tư vấn. 
Nếu RAW_DATA rỗng (mảng []), hãy xin lỗi khách là chưa có hàng.`
      }, { fetch: customFetch as any });

      const step2Prompt = `USER_MESSAGE: ${message}\n\nRAW_DATA: ${JSON.stringify(rawData)}`;
      const step2Result = await step2Model.generateContent(step2Prompt);
      
      return step2Result.response.text();

    } catch (error: any) {
      console.error("LỖI HỆ THỐNG AI 2-PASS:", error);
      return `Xin lỗi, tôi gặp khó khăn khi kết nối. Chi tiết: ${error?.message || 'Lỗi mạng'}`;
    }
  }
}
