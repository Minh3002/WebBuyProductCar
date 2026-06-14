const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb+srv://truonggiaminh123:vhoD5z6UvZ2k8rmU@cluster0.qwpnkow.mongodb.net/Web_Parts_Car?appName=Cluster0&retryWrites=true&w=majority');
  
  const Customer = mongoose.connection.collection('customers');
  const Order = mongoose.connection.collection('orders');

  const customers = await Customer.find({}).toArray();
  console.log("Customers:");
  customers.forEach(c => console.log(`_id: ${c._id}, phone: ${c.phone}, email: ${c.email}`));

  const orders = await Order.find({}).toArray();
  console.log("\nOrders:");
  orders.forEach(o => console.log(`_id: ${o._id}, customer_phone: ${o.customer_phone}, customer_id: ${o.customer_id}, status: ${o.status}`));

  process.exit(0);
}

test();
