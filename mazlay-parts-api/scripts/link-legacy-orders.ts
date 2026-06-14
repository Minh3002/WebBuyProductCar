import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../src/app.module';
import { Customer } from '../src/customers/schemas/customer.schema';
import { Order } from '../src/orders/schemas/order.schema';

function buildIdentifiers(customer: any): string[] {
  return [...new Set([
    customer._id?.toString(),
    customer.phone,
    customer.email
  ].filter((value): value is string => Boolean(value) && value !== 'Chưa cập nhật'))];
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const customerModel = app.get<Model<any>>(getModelToken(Customer.name));
  const orderModel = app.get<Model<any>>(getModelToken(Order.name));

  const customers = await customerModel.find({}).exec();
  let matchedOrders = 0;
  let updatedOrders = 0;

  console.log(`Scanning ${customers.length} customers for legacy order links...`);

  for (const customer of customers) {
    const identifiers = buildIdentifiers(customer);
    if (identifiers.length === 0) {
      continue;
    }

    const result = await orderModel.updateMany(
      {
        $or: [
          { customer_id: { $in: identifiers } },
          { customer_phone: { $in: identifiers } },
          { customer_email: { $in: identifiers } },
          { email: { $in: identifiers } },
          { userId: { $in: identifiers } }
        ]
      },
      {
        $set: {
          customer_id: customer._id.toString(),
          userId: customer._id.toString()
        }
      }
    ).exec();

    matchedOrders += result.matchedCount ?? 0;
    updatedOrders += result.modifiedCount ?? 0;
  }

  console.log(`Done. Matched ${matchedOrders} orders, updated ${updatedOrders} orders.`);
  await app.close();
}

bootstrap().catch((error) => {
  console.error('Failed to link legacy orders:', error);
  process.exit(1);
});
