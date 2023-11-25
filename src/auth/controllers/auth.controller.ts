import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { LoginRequest } from '../requests/login.request';
import { LoginResponse } from '../responses/login.response';
import { Public, Roles } from '../decorators/auth.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';

@Controller()
export class AuthController {
  constructor(private authServie: AuthService) {}

  @Public()
  @Post('/login')
  @Roles(UserRole.CUSTOMER)
  async login(@Body() requestBody: LoginRequest): Promise<LoginResponse> {
    return this.authServie.login(requestBody);
  }
}
