import { IsDate, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrderRequest {
  @IsOptional()
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
