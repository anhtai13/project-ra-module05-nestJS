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
  firstName: string;

  @IsOptional()
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
