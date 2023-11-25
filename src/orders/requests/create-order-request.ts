import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderRequest {
  @IsNotEmpty()
  @IsInt()
  serialNumber: number;

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

  @IsOptional()
  note?: string;
}
