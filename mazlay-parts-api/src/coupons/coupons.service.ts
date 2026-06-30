import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  async findAll(): Promise<Coupon[]> {
    return this.couponModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(createCouponDto: any): Promise<Coupon> {
    const existing = await this.couponModel.findOne({ code: createCouponDto.code }).exec();
    if (existing) throw new BadRequestException('Mã giảm giá đã tồn tại');
    const newCoupon = new this.couponModel(createCouponDto);
    return newCoupon.save();
  }

  async update(id: string, updateCouponDto: any): Promise<Coupon> {
    const updated = await this.couponModel.findByIdAndUpdate(id, updateCouponDto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Không tìm thấy mã giảm giá');
    return updated;
  }

  async remove(id: string): Promise<any> {
    const result = await this.couponModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Không tìm thấy mã giảm giá');
    return { success: true };
  }

  async validate(code: string): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ code, isActive: true }).exec();
    if (!coupon) throw new BadRequestException('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    return coupon;
  }

  async bulkDelete(ids: string[]): Promise<any> {
    const result = await this.couponModel.deleteMany({ _id: { $in: ids as any[] } }).exec();
    return { success: true, message: 'Xóa hàng loạt thành công', deletedCount: result.deletedCount };
  }
}
