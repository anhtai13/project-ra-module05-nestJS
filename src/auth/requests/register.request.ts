import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { UserRole } from 'src/users/enums/user-role.enum';

export class RegisterRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(4, 10)
  username: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Length(8, 20)
  password: string;

  @IsOptional()
  role?: UserRole = UserRole.CUSTOMER;
}
