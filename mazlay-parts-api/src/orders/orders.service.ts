import { Injectable, BadRequestException, NotFoundException, Logger, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly mailerService: MailerService,
  ) {}

  private groupOrderQuantities(items: CreateOrderDto['items']) {
    return items.reduce((acc, item) => {
      const productId = item.product_id;
      acc.set(productId, (acc.get(productId) || 0) + Number(item.quantity || 0));
      return acc;
    }, new Map<string, number>());
  }

  private async validateOrderStock(items: CreateOrderDto['items']) {
    const quantitiesByProduct = this.groupOrderQuantities(items);

    for (const [productId, quantity] of quantitiesByProduct.entries()) {
      if (!Types.ObjectId.isValid(productId)) {
        throw new BadRequestException('Mã sản phẩm không hợp lệ');
      }

      const product = await this.productModel.findById(productId).exec();
      if (!product) {
        throw new BadRequestException('Sản phẩm không tồn tại');
      }

      if (quantity <= 0) {
        throw new BadRequestException(`Số lượng đặt mua của [${product.title}] không hợp lệ.`);
      }

      if (product.stock_quantity < quantity) {
        throw new BadRequestException(
          `Sản phẩm [${product.title}] chỉ còn ${product.stock_quantity} sản phẩm trong kho.`,
        );
      }
    }
  }

  private async deductStockForItems(items: CreateOrderDto['items'], session?: any) {
    const quantitiesByProduct = this.groupOrderQuantities(items);

    for (const [productId, quantity] of quantitiesByProduct.entries()) {
      if (!Types.ObjectId.isValid(productId)) {
        throw new BadRequestException('Mã sản phẩm trong đơn hàng không hợp lệ');
      }

      const orderItem = items.find((item) => item.product_id === productId);
      const updatedProduct = await this.productModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(productId),
          stock_quantity: { $gte: quantity },
        },
        { $inc: { stock_quantity: -quantity } },
        { new: true, session },
      ).exec();

      if (!updatedProduct) {
        throw new BadRequestException(
          `Sản phẩm [${orderItem?.title || productId}] (OEM: ${orderItem?.oem_code || 'N/A'}) đã hết hàng hoặc không đủ số lượng.`,
        );
      }
      await this.productModel.updateOne(
        { _id: updatedProduct._id },
        { $set: { in_stock: updatedProduct.stock_quantity > 0 } },
        { session },
      ).exec();
    }
  }

  async onModuleInit() {
    const count = await this.orderModel.countDocuments({ status: 'Hoàn thành' }).exec();
    if (count === 0) {
      this.logger.log('Đang khởi tạo dữ liệu mẫu (Seed) cho trang Thống kê...');
      const products = await this.productModel.find().limit(3).exec();
      if (products.length > 0) {
        const dummyOrders = [
          {
            customer_phone: '0988888888',
            customer_name: 'Khách hàng Mẫu 1',
            shipping_address: 'Hà Nội',
            vin_number: 'ABCDEF12345678901',
            payment_method: 'COD',
            total_amount: products[0].price * 5,
            status: 'Hoàn thành',
            items: [{
              product_id: products[0]._id.toString(),
              title: products[0].title,
              oem_code: products[0].oem_code,
              price_at_purchase: products[0].price,
              quantity: 5
            }]
          },
          {
            customer_phone: '0999999999',
            customer_name: 'Khách hàng Mẫu 2',
            shipping_address: 'TP HCM',
            vin_number: '1234567890ABCDEF1',
            payment_method: 'TRANSFER',
            total_amount: (products[1]?.price || 100) * 3,
            status: 'Hoàn thành',
            items: [{
              product_id: products[1]?._id.toString() || '60c72b2f9b1e8a001c8e4b3b',
              title: products[1]?.title || 'Sản phẩm ảo',
              oem_code: products[1]?.oem_code || 'OEM-123',
              price_at_purchase: products[1]?.price || 100,
              quantity: 3
            }]
          }
        ];
        await this.orderModel.insertMany(dummyOrders);
        this.logger.log('Đã tạo xong dữ liệu mẫu đơn hàng!');
      }
    }
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    await this.validateOrderStock(createOrderDto.items);

    // 1. Kiểm tra / Lưu khách hàng
    let customer;

    if (createOrderDto.customer_id) {
      // Đã đăng nhập
      customer = await this.customerModel.findById(createOrderDto.customer_id).exec();
      if (customer) {
        createOrderDto.customer_id = customer._id.toString();
        createOrderDto.userId = customer._id.toString();
        createOrderDto.customer_email = customer.email || createOrderDto.customer_email || createOrderDto.email;
        createOrderDto.email = createOrderDto.customer_email;

        const shouldAttachPhone = createOrderDto.customer_phone && (
          !customer.phone ||
          customer.phone === 'Chưa cập nhật' ||
          customer.phone === 'ChÆ°a cáº­p nháº­t'
        );

        if (shouldAttachPhone) {
          customer.phone = createOrderDto.customer_phone;
        }

        let profileChanged = Boolean(shouldAttachPhone);

        if (!customer.name && createOrderDto.customer_name) {
          customer.name = createOrderDto.customer_name;
          profileChanged = true;
        }

        if (!customer.full_name && createOrderDto.customer_name) {
          customer.full_name = createOrderDto.customer_name;
          profileChanged = true;
        }

        if (!customer.address && createOrderDto.shipping_address) {
          customer.address = createOrderDto.shipping_address;
          profileChanged = true;
        }

        if (profileChanged) {
          await customer.save();
        }

        await this.linkExistingOrdersToCustomer(customer);
      }
    } else {
      // Khách vãng lai, kiểm tra xem SĐT đã tồn tại chưa
      customer = await this.customerModel.findOne({
        $or: [{ _id: createOrderDto.customer_phone }, { phone: createOrderDto.customer_phone }, { email: createOrderDto.customer_phone }]
      } as any).exec();
    }

    if (!customer) {
      const SALT_ROUNDS = 10;
      const hashedPassword = await bcrypt.hash('12345', SALT_ROUNDS);
      
      customer = new this.customerModel({
        _id: createOrderDto.customer_phone,
        name: createOrderDto.customer_name,
        full_name: createOrderDto.customer_name,
        email: '',
        phone: createOrderDto.customer_phone,
        password: hashedPassword,
        role: 'customer',
        isActive: true,
        owned_vehicles: []
      });
      await customer.save();
    }

    // 2. Tạo đơn hàng
    const newOrder = new this.orderModel(createOrderDto);
    newOrder.status = 'Chờ duyệt';
    const savedOrder = await newOrder.save();
    try {
      await this.deductStockForItems(createOrderDto.items);
      savedOrder.stock_deducted = true;
      await savedOrder.save();
    } catch (error) {
      throw error;
    }

    // 3. Tự động gửi Email thông báo (Bất đồng bộ)
    this.sendOrderNotificationEmail(createOrderDto, savedOrder._id.toString())
      .then(() => {
        this.logger.log(`Gửi email thành công cho đơn hàng ${savedOrder._id}`);
      })
      .catch((err) => {
        this.logger.error(`Không thể gửi email cho đơn hàng ${savedOrder._id}:`, err);
      });

    console.log(`[Hệ thống] Đã tạo đơn hàng mới (${savedOrder._id}) và kích hoạt luồng gửi Email cho Admin!`);

    return savedOrder;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const session = await this.connection.startSession();

    try {
      let savedOrder: OrderDocument | null = null;

      await session.withTransaction(async () => {
        const order = await this.orderModel.findById(id).session(session).exec();
        if (!order) {
          throw new NotFoundException('Đơn hàng không tồn tại');
        }

        const previousStatus = order.status;
        const triggerDeductionStatuses = ['Đã duyệt', 'Hoàn thành', 'Đang giao'];

        // Nếu chuyển từ Chờ duyệt sang trạng thái cần trừ kho (tránh trừ 2 lần)
        if (previousStatus === 'Chờ duyệt' && triggerDeductionStatuses.includes(status) && !order.stock_deducted) {
          const quantitiesByProduct = this.groupOrderQuantities(order.items as any);

          for (const [productId, quantity] of quantitiesByProduct.entries()) {
            if (!Types.ObjectId.isValid(productId)) {
              throw new BadRequestException('Mã sản phẩm trong đơn hàng không hợp lệ');
            }

            const orderItem = order.items.find((item) => item.product_id === productId);
            const updatedProduct = await this.productModel.findOneAndUpdate(
              {
                _id: new Types.ObjectId(productId),
                stock_quantity: { $gte: quantity },
              },
              { $inc: { stock_quantity: -quantity } },
              { new: true, session },
            ).exec();

            if (!updatedProduct) {
              throw new BadRequestException(
                `Sản phẩm [${orderItem?.title || productId}] (OEM: ${orderItem?.oem_code || 'N/A'}) không đủ tồn kho để duyệt đơn.`,
              );
            }
          }

          order.stock_deducted = true;
        }

        order.status = status;
        savedOrder = await order.save({ session });
      });

      if (!savedOrder) {
        throw new InternalServerErrorException('Không thể cập nhật trạng thái đơn hàng');
      }

      return savedOrder;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Lỗi khi duyệt đơn hàng:', error);
      throw new InternalServerErrorException('Có lỗi hệ thống xảy ra khi duyệt đơn');
    } finally {
      await session.endSession();
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findMyHistory(identifier: string): Promise<Order[]> {
    const customer = await this.customerModel.findOne({
      $or: [{ _id: identifier }, { phone: identifier }, { email: identifier }]
    } as any).exec();

    const identifiers = this.getCustomerLookupValues(identifier, customer);

    return this.orderModel.find({
      $or: [
        { customer_id: { $in: identifiers } },
        { customer_phone: { $in: identifiers } },
        { customer_email: { $in: identifiers } },
        { email: { $in: identifiers } },
        { userId: { $in: identifiers } }
      ]
    }).sort({ createdAt: -1 }).exec();
  }

  private getCustomerLookupValues(identifier: string, customer?: CustomerDocument | null): string[] {
    const values = [
      identifier,
      customer?._id?.toString(),
      customer?.phone,
      customer?.email
    ];

    return [...new Set(values.filter((value): value is string =>
      Boolean(value) && value !== 'Chưa cập nhật'
    ))];
  }

  private async linkExistingOrdersToCustomer(customer: CustomerDocument) {
    const identifiers = this.getCustomerLookupValues(customer._id.toString(), customer);

    await this.orderModel.updateMany(
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
          userId: customer._id.toString(),
          customer_email: customer.email || undefined,
          email: customer.email || undefined
        }
      }
    ).exec();
  }

  async getTopProducts() {
    return this.orderModel.aggregate([
      { $match: { status: { $in: ['Đã duyệt', 'Đang giao', 'Hoàn thành'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product_id',
          title: { $first: '$items.title' },
          oem_code: { $first: '$items.oem_code' },
          total_quantity: { $sum: '$items.quantity' },
          total_revenue: { $sum: { $multiply: ['$items.quantity', '$items.price_at_purchase'] } }
        }
      },
      { $sort: { total_quantity: -1 } },
      { $limit: 10 }
    ]).exec();
  }

  private async sendOrderNotificationEmail(orderDto: CreateOrderDto, orderId: string) {
    const itemsHtml = orderDto.items.map(item => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.oem_code}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.price_at_purchase.toLocaleString('vi-VN')} đ</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h2>Thông Báo Đơn Hàng Mới Từ Hệ Thống Mazlay Parts</h2>
      <p>Mã Đơn Hàng: <strong>${orderId}</strong></p>
      
      <h3>1. Thông tin Khách hàng</h3>
      <ul>
        <li><strong>Họ tên:</strong> ${orderDto.customer_name}</li>
        <li><strong>Số điện thoại:</strong> ${orderDto.customer_phone}</li>
        <li><strong>Địa chỉ:</strong> ${orderDto.shipping_address}</li>
        <li><strong>Số khung (VIN):</strong> ${orderDto.vin_number}</li>
        <li><strong>Phương thức TT:</strong> ${orderDto.payment_method}</li>
      </ul>

      <h3>2. Chi tiết Phụ tùng</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd;">Tên phụ tùng</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Mã OEM</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Số lượng</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Đơn giá</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">TỔNG CỘNG:</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #FF2F2F;">${orderDto.total_amount.toLocaleString('vi-VN')} đ</td>
          </tr>
        </tfoot>
      </table>
      <p><br>Vui lòng đăng nhập trang Admin để duyệt đơn hàng này.</p>
    `;

    await this.mailerService.sendMail({
      to: 'minhtg2003@gmail.com',
      subject: `[Mazlay Parts] Thông Báo Đơn Hàng Mới Từ Khách Hàng - Mã Đơn: ${orderId}`,
      html: htmlContent,
    });
  }

  async bulkDelete(ids: string[]): Promise<{ message: string; deletedCount: number }> {
    const result = await this.orderModel.deleteMany({ _id: { $in: ids as any[] } }).exec();
    return { message: 'Xóa hàng loạt thành công', deletedCount: result.deletedCount };
  }
}
