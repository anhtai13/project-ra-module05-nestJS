import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginResponse } from '../responses/login.response';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRequest } from '../requests/login.request';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/users/enums/user-role.enum';
import { SALT_OR_ROUNDS } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getAuth(id: number): Promise<any> {
    return this.userRepository.findOneBy({ id });
  }

  async auth(loginRequest: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findOneBy({
      username: loginRequest.username,
      avatar: loginRequest.avatar,
    });

    // Kiểm tra mật khẩu, nếu ko trùng khớp thì trả về lỗi
    const isMatch = await bcrypt.compare(loginRequest.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Tạo ra token (sử dụng JWT)
    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    const loginResponse = new LoginResponse();
    loginResponse.token = token;

    // Trả về token cho client
    return loginResponse;
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findOneBy({
      username: loginRequest.username,
    });

    // Nếu ko tìm thấy user thì trả về lỗi
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Kiểm tra mật khẩu, nếu ko trùng khớp thì trả về lỗi
    const isMatch = await bcrypt.compare(loginRequest.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Tạo ra token (sử dụng JWT)
    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    const loginResponse = new LoginResponse();
    loginResponse.token = token;

    // Trả về token cho client
    return loginResponse;
  }

  async register(params): Promise<any> {
    const newUser = new User();
    newUser.username = params.username;
    newUser.email = params.email;
    newUser.first_name = params.first_name;
    newUser.last_name = params.last_name;
    newUser.password = await bcrypt.hash(params.password, SALT_OR_ROUNDS);
    newUser.role = '2';
    const user = await this.userRepository.save(newUser);

    return { message: 'User created successfully', user };
  }
}
