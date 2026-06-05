import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
  ],
  controllers: [AiChatController],
  providers: [AiChatService],
})
export class AiChatModule {}
