import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true, enum: ['SUPER_ADMIN', 'STAFF'], default: 'STAFF' })
  role: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
