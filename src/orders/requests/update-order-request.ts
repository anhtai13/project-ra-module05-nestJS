import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateOrderRequest {
  @IsOptional()
  orderAt: string;

  @IsNotEmpty()
  totalPrice: number;

  @IsNotEmpty()
  status: string;

  @IsOptional()
  createdAt: string;
}
