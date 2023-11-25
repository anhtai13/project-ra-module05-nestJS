import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class UpdateProductRequest {
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @MaxLength(50)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;
}
