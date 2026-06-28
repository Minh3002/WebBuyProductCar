import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccessLogDocument = AccessLog & Document;

@Schema({ timestamps: true })
export class AccessLog {
  @Prop({ required: true })
  ip: string;

  @Prop()
  isp: string;

  @Prop()
  location: string;

  @Prop()
  browser: string;

  @Prop()
  os: string;

  @Prop()
  deviceType: string;

  @Prop()
  entrySource: string;

  @Prop()
  resolution: string;

  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  userEmail: string;

  @Prop({ default: 'Guest' })
  userRole: string;

  @Prop()
  userAgent: string;
}

export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);
