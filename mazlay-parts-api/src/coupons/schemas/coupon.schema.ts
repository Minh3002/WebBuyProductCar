import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  discount_value: number; // Tương đương VND hoặc % (giả sử VND cho dễ)

  @Prop({ default: true })
  isActive: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
