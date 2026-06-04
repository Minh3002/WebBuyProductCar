import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  // Hardcoded Admin Users theo yêu cầu
  private admins = [
    {
      email: 'minh.admin@mazlayparts.com',
      phone: '0911111111',
      full_name: 'Admin Minh',
      password: '123456',
      role: 'admin'
    },
    {
      email: 'men.admin@mazlayparts.com',
      phone: '0922222222',
      full_name: 'Admin Mến',
      password: '123456',
      role: 'admin'
    }
  ];

  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    try {
      // 1. Tìm trong bảng Admin trước
      let user: any = this.admins.find(a => a.email === identifier || a.phone === identifier);
      let role = 'admin';

      // 2. Nếu không phải Admin, tìm tiếp trong bảng Customer
      if (!user) {
        user = await this.customerModel.findOne({
          $or: [{ _id: identifier }, { email: identifier }]
        } as any);
        role = 'customer';
      }

      // 3. Nếu không tìm thấy bất kỳ tài khoản nào
      if (!user || !user.password) {
        throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
      }

      // 4. So sánh mật khẩu an toàn
      let isMatch = false;
      if (role === 'admin') {
        isMatch = (password === user.password); // Admin dùng Plain Text
      } else {
        if (user.password && user.password.startsWith('$2b$')) {
           isMatch = await bcrypt.compare(password, user.password);
        } else {
           isMatch = (password === user.password); // Fallback tài khoản cũ
        }
      }

      if (!isMatch) {
        throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
      }

      // 5. Trả về JWT Token hợp lệ nếu thành công
      if (role === 'admin') {
        return {
          access_token: this.jwtService.sign({ identifier, role: user.role, full_name: user.full_name }),
          user: { identifier, role: user.role, full_name: user.full_name }
        };
      } else {
        return {
          access_token: this.jwtService.sign({ identifier: user._id, role: user.role, name: user.name }),
          user: { 
            identifier: user._id, 
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            owned_vehicles: user.owned_vehicles
          }
        };
      }

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Chặn hoàn toàn lỗi sập hệ thống 500, quy về thông báo chuẩn
      throw new InternalServerErrorException('Có lỗi xảy ra, vui lòng thử lại');
    }
  }

  async register(registerDto: RegisterDto) {
    const { phone, email, full_name, address } = registerDto;

    // Check existing
    const existing = await this.customerModel.findById(phone);
    if (existing) {
      throw new BadRequestException('Số điện thoại này đã được đăng ký!');
    }

    if (email) {
      const existingEmail = await this.customerModel.findOne({ email });
      if (existingEmail) {
        throw new BadRequestException('Email này đã được sử dụng!');
      }
    }

    // Mặc định khách hàng là 12345 nhưng mã hóa bcrypt an toàn
    const SALT_ROUNDS = 10;
    const finalPassword = await bcrypt.hash('12345', SALT_ROUNDS);

    const newCustomer = new this.customerModel({
      _id: phone,
      name: full_name,
      email,
      phone,
      password: finalPassword,
      role: 'customer',
      isActive: true,
      owned_vehicles: []
    });

    await newCustomer.save();

    return {
      message: 'Đăng ký thành công',
      user: {
        phone: newCustomer._id,
        name: newCustomer.name,
        role: newCustomer.role
      }
    };
  }
}
