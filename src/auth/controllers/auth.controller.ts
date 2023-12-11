import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { LoginRequest } from '../requests/login.request';
import { LoginResponse } from '../responses/login.response';
import { Public } from '../decorators/auth.decorator';

@Controller()
export class AuthController {
  constructor(private authServie: AuthService) {}

  @Get('/auth')
  getProfile(@Request() req) {
    console.log(req['user']);

    return this.authServie.getAuth(req['user'].sub);
  }

  @Public()
  @Post('/login')
  // @Roles(UserRole.CUSTOMER)
  async login(@Body() requestBody: LoginRequest): Promise<LoginResponse> {
    return this.authServie.login(requestBody);
  }
}
