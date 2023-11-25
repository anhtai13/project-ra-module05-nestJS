import { IsNotEmpty, IsNumber, IsOptional, IsPositive, MaxLength } from 'class-validator';

export class CreateProductRequest {
  @IsNotEmpty()
  @MaxLength(20)
  sku: string;

  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  category: string;

  @IsOptional()
  @MaxLength(50)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  unitPrice: number;
}
