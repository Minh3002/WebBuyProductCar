import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { CouponsModule } from './coupons/coupons.module';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { AccessLogsModule } from './access-logs/access-logs.module';
import { AccessLogMiddleware } from './access-logs/access-logs.middleware';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make config available everywhere
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('SMTP_USER') || 'nhatduong7975@gmail.com',
            pass: configService.get<string>('SMTP_PASS') || 'gezeoyeltqpmlobc',
          },
        },
        defaults: {
          from: '"Mazlay Parts Hệ Thống" <no-reply@mazlayparts.com>',
        },
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    CustomersModule,
    OrdersModule,
    AuthModule,
    CouponsModule,
    AiChatModule,
    AccessLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessLogMiddleware).forRoutes('*');
  }
}
