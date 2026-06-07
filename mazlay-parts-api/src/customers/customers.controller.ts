import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
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
  updateProfile(@Req() req: any, @Body() updateData: any) {
    const identifier = req.user?.identifier;
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
}
