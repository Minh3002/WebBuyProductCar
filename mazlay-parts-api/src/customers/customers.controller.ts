import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';

@UseGuards(AuthGuard('jwt'))
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  // Lấy thông tin cá nhân của User hiện tại
  @Get('profile')
  getProfile(@Req() req: any) {
    const identifier = req.user?.identifier;
    return this.customersService.findOne(identifier);
  }

  // Cập nhật thông tin cá nhân của User hiện tại
  @Put('profile')
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    const identifier = req.user?.identifier;
    
    if (updateData.email) {
      // Kiểm tra trùng lặp email
      const existingEmail = await this.customersService.findByCondition({ email: updateData.email });
      if (existingEmail && existingEmail._id !== identifier) {
        throw new BadRequestException('Email đã được sử dụng bởi tài khoản khác');
      }
    }

    return this.customersService.update(identifier, updateData);
  }

  @Post()
  create(@Body() createCustomerDto: any) {
    return this.customersService.create(createCustomerDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    if (!body.ids || !Array.isArray(body.ids)) {
      return { success: false, message: 'Invalid data' };
    }
    return this.customersService.bulkDelete(body.ids);
  }
}
