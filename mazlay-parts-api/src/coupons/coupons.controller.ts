import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('validate')
  validate(@Body('code') code: string) {
    return this.couponsService.validate(code);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCouponDto: any) {
    return this.couponsService.create(createCouponDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: any) {
    return this.couponsService.update(id, updateCouponDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
