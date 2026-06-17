import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
export class Compatibility {
  @Prop()
  year: string;

  @Prop()
  make: string;

  @Prop()
  model: string;

  @Prop()
  engine: string;
}

export const CompatibilitySchema = SchemaFactory.createForClass(Compatibility);

@Schema({ _id: false })
export class Specification {
  @Prop()
  label: string;

  @Prop()
  value: string;
}

export const SpecificationSchema = SchemaFactory.createForClass(Specification);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true, uppercase: true })
  oem_code: string;

  @Prop()
  brand: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  old_price: number;

  @Prop()
  category: string;

  @Prop()
  image_url: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, default: 0 })
  stock_quantity: number;

  @Prop({ default: true })
  in_stock: boolean;

  @Prop()
  description: string;

  @Prop()
  origin: string;

  @Prop()
  warranty: string;

  @Prop()
  condition: string;

  @Prop({ type: [SpecificationSchema], default: [] })
  specifications: Specification[];

  @Prop({ type: [CompatibilitySchema], default: [] })
  compatibility: Compatibility[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Đánh chỉ mục (Compound Index) cho bộ lọc 4 tầng
ProductSchema.index(
  { 'compatibility.year': 1, 'compatibility.make': 1, 'compatibility.model': 1, 'compatibility.engine': 1 }
);
