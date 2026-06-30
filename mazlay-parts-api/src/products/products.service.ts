import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  private normalizeProductPayload(payload: any, options: { requireStock?: boolean } = {}): any {
    const normalized = { ...payload };

    if (
      options.requireStock &&
      (normalized.stock_quantity === undefined ||
        normalized.stock_quantity === null ||
        normalized.stock_quantity === '')
    ) {
      throw new BadRequestException('Vui lòng nhập số lượng tồn kho');
    }

    if (typeof normalized.images === 'string') {
      try {
        normalized.images = JSON.parse(normalized.images);
      } catch {
        normalized.images = normalized.images
          .split('\n')
          .map((url: string) => url.trim())
          .filter(Boolean);
      }
    }

    if (!Array.isArray(normalized.images)) {
      normalized.images = normalized.image_url ? [normalized.image_url] : [];
    }

    normalized.images = normalized.images
      .map((url: string) => String(url).trim())
      .filter(Boolean);

    if (typeof normalized.specifications === 'string') {
      try {
        normalized.specifications = JSON.parse(normalized.specifications);
      } catch {
        normalized.specifications = [];
      }
    }

    if (!Array.isArray(normalized.specifications)) {
      normalized.specifications = [];
    }

    normalized.price = Number(normalized.price || 0);
    normalized.old_price = Number(normalized.old_price || 0);
    normalized.stock_quantity = Number(normalized.stock_quantity || 0);
    if (!Number.isFinite(normalized.stock_quantity) || normalized.stock_quantity < 0) {
      throw new BadRequestException('Số lượng tồn kho không hợp lệ');
    }
    normalized.in_stock = normalized.stock_quantity > 0;
    normalized.oem_code = normalized.oem_code?.toUpperCase?.() || normalized.oem_code;
    normalized.image_url = normalized.images[0] || normalized.image_url || '';

    return normalized;
  }

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

    return this.productModel.find(filter).sort({ createdAt: -1 }).exec();
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
    const createdProduct = new this.productModel(
      this.normalizeProductPayload(createProductDto, { requireStock: true }),
    );
    return createdProduct.save();
  }

  async update(id: string, updateProductDto: any): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      this.normalizeProductPayload(updateProductDto),
      { new: true }
    ).exec();
    if (!updatedProduct) throw new NotFoundException('Sản phẩm không tồn tại');
    return updatedProduct;
  }

  async remove(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) throw new NotFoundException('Sản phẩm không tồn tại');
    return { message: 'Xóa thành công', id };
  }

  async bulkDelete(ids: string[]): Promise<any> {
    const result = await this.productModel.deleteMany({ _id: { $in: ids as any[] } }).exec();
    return { message: 'Xóa hàng loạt thành công', deletedCount: result.deletedCount };
  }
}
