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
  constructor(private authService: AuthService) {}

  @Get('/auth')
  getProfile(@Request() req) {
    console.log(req['user']);

    return this.authService.getAuth(req['user'].sub);
  }

  @Public()
  @Post('/login')
  // @Roles(UserRole.CUSTOMER)
  async login(@Body() requestBody: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(requestBody);
  }

  @Public()
  @Post('register')
  async register(
    @Body()
    requestBody,
  ): Promise<any> {
    try {
      const result = await this.authService.register(requestBody);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
