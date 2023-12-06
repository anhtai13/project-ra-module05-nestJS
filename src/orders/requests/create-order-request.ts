import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateOrderRequest {
  @IsNotEmpty()
  @IsInt()
  serialNumber: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsDate()
  orderAt: Date;

  @IsInt()
  @IsNotEmpty()
  totalPrice: number;

  @IsNotEmpty()
  status: string;
}
