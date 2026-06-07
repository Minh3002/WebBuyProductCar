import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class AiChatService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async query(message: string): Promise<string> {
    const text = message.toLowerCase().trim();

    // 1. Kiểm tra câu chào
    if (/^(chào|shop ơi|alo|hey|hi|xin chào)/.test(text)) {
      return "Chào bạn! Bạn cần hỗ trợ tìm phụ tùng nào cho xe ạ?";
    }

    // 2. Bóc tách giá tiền
    let maxPrice = 999999999;
    let keyword = text;
    
    // Tìm các cụm giá tiền: số đi kèm triệu/tr/nghìn/k
    const priceRegex = /(\d+(?:\.\d+)?)\s*(triệu|tr|nghìn|k)/;
    const priceMatch = text.match(priceRegex);
    
    if (priceMatch) {
      const amount = parseFloat(priceMatch[1]);
      const unit = priceMatch[2];
      if (unit === 'triệu' || unit === 'tr') {
        maxPrice = amount * 1000000;
      } else if (unit === 'nghìn' || unit === 'k') {
        maxPrice = amount * 1000;
      }
      
      // Cắt bỏ cụm giá tiền ra khỏi từ khóa
      keyword = keyword.replace(priceMatch[0], '');
    }

    // 3. Lọc bỏ các từ thừa để lấy tên phụ tùng
    const stopWords = ['tìm', 'mua', 'cần', 'có', 'bán', 'giá', 'dưới', 'khoảng', 'cho', 'tôi', 'mình', 'em', 'anh', 'chị', 'giúp', 'cho', 'hỏi', 'có', 'không', 'ạ'];
    stopWords.forEach(word => {
      // Xóa các từ stopword đứng độc lập
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      keyword = keyword.replace(regex, '');
    });
    
    keyword = keyword.replace(/\s+/g, ' ').trim();

    if (!keyword) {
      return "Xin lỗi, mình chưa rõ bạn đang muốn tìm phụ tùng nào. Vui lòng nói rõ hơn nhé!";
    }

    // 4. Tìm kiếm trong Database
    const dbQuery = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { oem_code: { $regex: keyword, $options: 'i' } }
      ],
      price: { $lte: maxPrice }
    };

    const results = await this.productModel.find(dbQuery).lean().exec();

    // 5. Định dạng câu trả lời
    if (results.length === 0) {
      return `Xin lỗi bạn, hiện tại cửa hàng mình chưa có "${keyword}" trong tầm giá đó. Bạn có muốn tìm loại khác không ạ?`;
    }

    // Tìm giá thấp nhất và cao nhất
    let minPrice = results[0].price;
    let actualMaxPrice = results[0].price;
    
    for (const p of results) {
      if (p.price < minPrice) minPrice = p.price;
      if (p.price > actualMaxPrice) actualMaxPrice = p.price;
    }

    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    if (minPrice === actualMaxPrice) {
      return `Chào bạn! Cửa hàng mình đang có mẫu "${keyword}" với giá ${formatPrice(minPrice)}. Mời bạn xem chi tiết tại web nhé!`;
    }

    return `Chào bạn! Cửa hàng mình đang có các mẫu "${keyword}" với giá từ ${formatPrice(minPrice)} đến ${formatPrice(actualMaxPrice)}. Mời bạn xem chi tiết tại web nhé!`;
  }
}
