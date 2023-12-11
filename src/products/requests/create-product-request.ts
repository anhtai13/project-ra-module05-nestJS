import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreateProductRequest {
  @IsNotEmpty()
  sku: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  category: number;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  unit_price: number;

  @IsNotEmpty()
  image: string;
}
