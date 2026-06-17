import 'dotenv/config';
import mongoose from 'mongoose';

async function main() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI in environment');
  }

  await mongoose.connect(mongoUri);
  const products = mongoose.connection.collection('products');

  const missingStockResult = await products.updateMany(
    {
      $or: [
        { stock_quantity: { $exists: false } },
        { stock_quantity: null },
      ],
    },
    {
      $set: {
        stock_quantity: 0,
        in_stock: false,
      },
    },
  );

  const outOfStockResult = await products.updateMany(
    { stock_quantity: { $lte: 0 } },
    { $set: { in_stock: false } },
  );

  const inStockResult = await products.updateMany(
    { stock_quantity: { $gt: 0 } },
    { $set: { in_stock: true } },
  );

  console.log(`Products missing stock updated: ${missingStockResult.modifiedCount}`);
  console.log(`Products marked out of stock: ${outOfStockResult.modifiedCount}`);
  console.log(`Products marked in stock: ${inStockResult.modifiedCount}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
