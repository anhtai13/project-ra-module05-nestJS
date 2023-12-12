import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateOrderRequest {

  @PrimaryGeneratedColumn()
  order_id: number;
  // @IsNotEmpty()
  // @IsInt()
  // serialNumber: number;

  // @IsNotEmpty()
  // @IsInt()
  // userId: number;

  // @IsDate()
  // orderAt: Date;

  // @IsDate()
  // createdAt: Date;

  // @IsInt()
  // @IsNotEmpty()
  // totalPrice: number;

  // @IsNotEmpty()
  // status: string;

  cart: CreateOrderDetailsRequest[];
}

export class CreateOrderDetailsRequest {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
