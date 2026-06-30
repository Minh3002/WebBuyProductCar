import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    try {
      if (req.user?.identifier) {
        createOrderDto.customer_id = req.user.identifier;
      }
      return await this.ordersService.create(createOrderDto);
    } catch (error) {
      if (error instanceof HttpException) {
        const response = error.getResponse();
        const message =
          typeof response === 'string'
            ? response
            : (response as any)?.message || error.message;

        throw new HttpException({ message }, error.getStatus());
      }

      console.error('Create order error:', error);
      throw new InternalServerErrorException({
        message: error?.message || 'Không thể tạo đơn hàng',
      });
    }
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get('analytics/top-products')
  getTopProducts() {
    return this.ordersService.getTopProducts();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-history')
  findMyHistory(@Request() req) {
    return this.ordersService.findMyHistory(req.user.identifier);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    if (!body.ids || !Array.isArray(body.ids)) {
      return { message: 'Invalid data' };
    }
    return this.ordersService.bulkDelete(body.ids);
  }
}
