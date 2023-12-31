import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// https://github.com/typestack/class-validator#validation-decorators
export class CreateUserRequest {
  @IsNotEmpty()
  @Length(4, 10)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @MaxLength(50)
  first_name: string;

  @IsOptional()
  @MaxLength(50)
  last_name: string;

  @IsNotEmpty()
  @Length(8, 20)
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @Min(1)
  @Max(2)
  gender: number;

  @IsOptional()
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsOptional()
  @MaxLength(255)
  address: string;

  @IsOptional()
  avatar: string;

  @IsNotEmpty()
  role: string;
}
