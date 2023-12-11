import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class UpdateProductRequest {
  @IsOptional()
  name: string;

  @IsOptional()
  sku: string;

  @IsOptional()
  category: number;

  @IsOptional()
  @MaxLength(50)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  unit_price: number;

  @IsOptional()
  image?: string;
}
