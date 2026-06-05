import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(query: any): Promise<Product[]> {
    const filter: any = {};
    
    // Xử lý query category
    if (query.category) {
      filter.category = query.category;
    }

    // Xử lý bộ lọc 4 tầng (Mảng nested compatibility)
    if (query.year || query.make || query.model || query.engine) {
      filter.compatibility = { $elemMatch: {} };
      if (query.year) filter.compatibility.$elemMatch.year = query.year;
      if (query.make) filter.compatibility.$elemMatch.make = query.make;
      if (query.model) filter.compatibility.$elemMatch.model = query.model;
      if (query.engine) filter.compatibility.$elemMatch.engine = query.engine;
    }

    return this.productModel.find(filter).exec();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    return product;
  }

  async findByOem(oemCode: string): Promise<Product> {
    const product = await this.productModel.findOne({ oem_code: oemCode.toUpperCase() }).exec();
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    return product;
  }

  async create(createProductDto: any): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async update(id: string, updateProductDto: any): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true }
    ).exec();
    if (!updatedProduct) throw new NotFoundException('Sản phẩm không tồn tại');
    return updatedProduct;
  }

  async searchAi(keyword?: string, maxPrice?: number): Promise<any[]> {
    const query: any = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { oem_code: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }
    
    const results = await this.productModel.find(query).limit(10).lean().exec();
    return results.map(p => ({
      name: p.title,
      price: p.price,
      status: p.stock_quantity > 0 ? "Còn hàng" : "Hết hàng",
      oem_code: p.oem_code
    }));
  }

  async remove(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) throw new NotFoundException('Sản phẩm không tồn tại');
    return { message: 'Xóa thành công', id };
  }
}
