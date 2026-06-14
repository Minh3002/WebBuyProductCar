import { IsString, IsNotEmpty, IsEnum, IsNumber, ValidateNested, ArrayMinSize, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { IsValidVIN } from '../validators/vin.validator';

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  oem_code: string;

  @IsNumber()
  price_at_purchase: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  customer_email?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  customer_phone: string;

  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsString()
  @IsNotEmpty()
  shipping_address: string;

  @IsEnum(['COD', 'TRANSFER'])
  payment_method: string;

  @IsNumber()
  total_amount: number;

  @Transform(({ value }) => value?.toUpperCase())
  @IsValidVIN()
  vin_number: string;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ArrayMinSize(1)
  items: OrderItemDto[];
}
