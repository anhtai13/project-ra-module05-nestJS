import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { LoginRequest } from '../requests/login.request';
import { LoginResponse } from '../responses/login.response';
import { Public } from '../decorators/auth.decorator';

@Controller()
export class AuthController {
  constructor(private authServie: AuthService) {}

  @Public()
  @Post('/login')
  // @Roles(UserRole.CUSTOMER)
  async login(@Body() requestBody: LoginRequest): Promise<LoginResponse> {
    return this.authServie.login(requestBody);
  }
}
