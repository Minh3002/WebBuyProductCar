import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ type: String, required: true })
  _id: string; // Số điện thoại làm khóa chính

  @Prop()
  name: string;

  @Prop()
  full_name: string;

  @Prop()
  address: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ required: true, index: true })
  phone: string;

  @Prop()
  password: string;

  @Prop({ default: 'customer' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [Object], default: [] })
  owned_vehicles: any[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
