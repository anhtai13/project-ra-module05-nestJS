import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class UpdateProductRequest {
  @IsOptional()
  name: string;

  @IsOptional()
  sku: string;

  @IsOptional()
  category: number;

  @IsOptional()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  unit_price: number;

  @IsOptional()
  image?: string;
}
