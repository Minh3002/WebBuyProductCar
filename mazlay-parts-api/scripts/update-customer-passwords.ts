import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Customer } from '../src/customers/schemas/customer.schema';
import { Model } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const customerModel = app.get<Model<any>>(getModelToken(Customer.name));

  console.log('Bắt đầu đồng bộ mật khẩu khách hàng thành chữ thô...');

  const customers = await customerModel.find({});
  let updatedCount = 0;

  for (const customer of customers) {
    if (customer.password !== '12345') {
      console.log(`Đang cập nhật mật khẩu về "12345" thô cho khách hàng: ${customer._id}`);
      await customerModel.updateOne(
        { _id: customer._id },
        { $set: { password: '12345' } }
      );
      updatedCount++;
    }
  }

  console.log(`Đã hoàn tất đồng bộ! Cập nhật thành công ${updatedCount} khách hàng về chữ thô.`);
  await app.close();
}

bootstrap();
