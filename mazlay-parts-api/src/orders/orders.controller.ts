import { Controller, Post, Body, Patch, Param, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    if (req.user?.identifier) {
      createOrderDto.customer_id = req.user.identifier;
    }
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('analytics/top-products')
  getTopProducts() {
    return this.ordersService.getTopProducts();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-history')
  findMyHistory(@Request() req) {
    return this.ordersService.findMyHistory(req.user.identifier);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
