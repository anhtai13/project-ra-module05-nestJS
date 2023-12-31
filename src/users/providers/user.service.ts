import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRequest } from '../requests/create-user-request';
import { User } from '../entities/user.entity';
import { UpdateUserRequest } from '../requests/update-user-request';
import { UserResponse } from '../responses/user.response';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/common/constants';
import { UserProfile } from '../entities/user-profile.entity';
import * as fs from 'fs';
import { getFileExtension } from 'src/utilites/upload.util';

// Tài liệu: https://docs.nestjs.com/providers#services
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async search(
    keyword?: string,
    page?: number,
    limit?: number,
  ): Promise<[User[], number]> {
    return await this.userRepository.findAndCount({
      relations: {
        profile: true,
        passwords: true,
        // roles: true,
      },
      where: [
        { username: ILike(`%${keyword || ''}%`) },
        { email: ILike(`%${keyword || ''}%`) },
      ],

      order: { id: 'DESC' }, // ORDER BY
      take: limit, // Tương đương LIMIT
      skip: (page - 1) * limit, // Tương đương OFFSET
    });
  }

  // async create(createUser: CreateUserRequest): Promise<void> {
  //   const user: User = new User();
  //   user.username = createUser.username;
  //   user.email = createUser.email;
  //   user.firstName = createUser.firstName;
  //   user.lastName = createUser.lastName;
  //   user.password = await bcrypt.hash(createUser.password, SALT_OR_ROUNDS); // Mã hóa

  //   await this.userRepository.save(user);
  // }

  async create(
    createUser: CreateUserRequest,
    avatar: Express.Multer.File,
  ): Promise<void> {
    let originalname: string | null = null;
    let path: string | null = null;
    let avatarLocation: string | null = null;

    if (avatar) {
      originalname = avatar.originalname;
      path = avatar.path;
    }

    const isExistEmailOrUsername = await this.userRepository.findOne({
      where: [{ username: createUser.username }, { email: createUser.email }],
    });

    if (isExistEmailOrUsername) {
      throw new BadRequestException();
    }

    let avatarPath = null;

    if (avatar) {
      const avatarExtension = getFileExtension(originalname);
      avatarPath = `avatar/${createUser.username}.${avatarExtension}`;
      avatarLocation = `./public/${avatarPath}`;

      // Ghi file vào thư mục lưu trữ
      fs.writeFileSync(avatarLocation, avatar.buffer);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user: User = new User();
      user.username = createUser.username;
      user.email = createUser.email;
      user.first_name = createUser.first_name;
      user.last_name = createUser.last_name;
      user.avatar = avatarPath;
      user.role = createUser.role;
      user.password = await bcrypt.hash(createUser.password, SALT_OR_ROUNDS);
      await queryRunner.manager.save(user);

      const userProfile = new UserProfile();
      userProfile.gender = createUser.gender;
      userProfile.phoneNumber = createUser.phoneNumber;
      userProfile.address = createUser.address;
      userProfile.user = user;
      await queryRunner.manager.save(userProfile);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (avatarLocation) {
        fs.rmSync(avatarLocation);
      }

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async find(id: number): Promise<UserResponse> {
    const user: User = await this.userRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!user) {
      throw new NotFoundException();
    }

    return new UserResponse(user);
  }

  async update(
    id: number,
    updateUser: UpdateUserRequest,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const user: User = await this.userRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let avatarLocation: string | null = null;
    let avatarPath: string | null = null;

    console.log('avatar', avatar);

    if (avatar) {
      // Xử lý avatar nếu được cung cấp
      const avatarExtension = getFileExtension(avatar.originalname);
      avatarPath = `avatar/${user.username}.${avatarExtension}`;
      avatarLocation = `./public/${avatarPath}`;

      // Ghi file vào thư mục lưu trữ
      fs.writeFileSync(avatarLocation, avatar.buffer);
    }

    // Cập nhật thông tin người dùng
    user.first_name = updateUser.first_name || user.first_name;
    user.last_name = updateUser.last_name || user.last_name;
    user.avatar = avatarPath || user.avatar;
    user.role = updateUser.role || user.role;

    if (updateUser.password) {
      // Nếu cung cấp mật khẩu mới, mã hóa và cập nhật
      user.password = await bcrypt.hash(updateUser.password, SALT_OR_ROUNDS);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      // Nếu có lỗi, xóa avatar đã tạo (nếu có)
      if (avatarLocation) {
        fs.rmSync(avatarLocation);
      }

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<void> {
    const user: User = await this.userRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!user) {
      throw new NotFoundException();
    }

    this.userRepository.softRemove({ id });
  }
}
