import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<CustomerDocument>) {}

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
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

  async update(id: string, updateCustomerDto: any): Promise<Customer> {
    const customer = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true }).exec();
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');
    return customer;
  }

  async remove(id: string): Promise<any> {
    const result = await this.customerModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Không tìm thấy khách hàng');
    return { success: true };
  }
}
