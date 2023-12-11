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
  category: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  unitPrice: number;

  @IsOptional()
  image?: string;
}
