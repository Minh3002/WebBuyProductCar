import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');
    return customer;
  }

  async findByCondition(condition: any): Promise<Customer | null> {
    return this.customerModel.findOne(condition).exec();
  }

  async create(createCustomerDto: any): Promise<Customer> {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash('12345', SALT_ROUNDS);

    const newCustomer = new this.customerModel({
      ...createCustomerDto,
      _id: createCustomerDto.phone,
      password: hashedPassword,
      role: 'customer',
      isActive: true,
      owned_vehicles: []
    });
    return newCustomer.save();
  }

  async update(id: string, updateCustomerDto: any): Promise<any> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');

    // Nếu khách đổi SĐT và SĐT cũ đang là _id
    if (updateCustomerDto.phone && updateCustomerDto.phone !== customer.phone && customer._id === customer.phone) {
      // 1. Tạo Customer mới với _id = SĐT mới
      const newCustomerData = customer.toObject();
      newCustomerData._id = updateCustomerDto.phone;
      // Trộn thêm dữ liệu update mới
      Object.assign(newCustomerData, updateCustomerDto);
      
      const newCustomer = new this.customerModel(newCustomerData);
      await newCustomer.save();

      // 2. Cập nhật tất cả Orders có customer_phone = SĐT cũ -> SĐT mới
      await this.orderModel.updateMany(
        {
          $or: [
            { customer_phone: customer.phone },
            { customer_id: customer.phone }
          ]
        },
        { 
          $set: { 
            customer_phone: updateCustomerDto.phone,
            customer_id: updateCustomerDto.phone
          } 
        }
      ).exec();

      // 3. Xóa Customer mang SĐT cũ
      await this.customerModel.findByIdAndDelete(id).exec();

      // Trả về cờ báo hiệu Frontend cần logout
      return { ...newCustomer.toObject(), requireRelogin: true };
    }

    // Trường hợp không đổi SĐT hoặc đổi nhưng _id không phải là SĐT (Google Auth)
    const updatedCustomer = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true }).exec();
    if (updatedCustomer) {
      await this.linkExistingOrdersToCustomer(updatedCustomer);
    }
    return updatedCustomer;
  }

  async remove(id: string): Promise<any> {
    const result = await this.customerModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Không tìm thấy khách hàng');
    return { success: true };
  }

  private async linkExistingOrdersToCustomer(customer: CustomerDocument) {
    const identifiers = [
      customer._id?.toString(),
      customer.phone,
      customer.email
    ].filter((value): value is string => Boolean(value) && value !== 'Chưa cập nhật');

    if (identifiers.length === 0) {
      return;
    }

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
      { $set: { customer_id: customer._id.toString(), userId: customer._id.toString() } }
    ).exec();
  }
}
