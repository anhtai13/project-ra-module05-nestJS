import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserRequest {
  @IsOptional()
  @MaxLength(50)
  first_name: string;

  @IsOptional()
  @MaxLength(50)
  last_name: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  role: string;

  @IsOptional()
  avatar?: string;
}
