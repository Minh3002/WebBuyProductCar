import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  product_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  oem_code: string;

  @Prop({ required: true })
  price_at_purchase: number;

  @Prop({ required: true })
  quantity: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: false })
  customer_id: string;

  @Prop({ required: false })
  userId: string;

  @Prop({ required: false })
  customer_email: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: true })
  customer_phone: string;

  @Prop({ required: true })
  customer_name: string;

  @Prop({ required: true })
  shipping_address: string;

  @Prop({ required: true, enum: ['COD', 'TRANSFER'] })
  payment_method: string;

  @Prop({ required: true })
  total_amount: number;

  @Prop({ required: true, enum: ['Chờ duyệt', 'Đã duyệt', 'Đang giao', 'Hoàn thành', 'Đã hủy'], default: 'Chờ duyệt' })
  status: string;

  @Prop({ default: false })
  stock_deducted: boolean;

  @Prop({ required: true, maxlength: 17, minlength: 17 })
  vin_number: string;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
