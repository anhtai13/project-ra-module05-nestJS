import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserRequest } from '../requests/create-user-request';
import { UsersService } from '../providers/user.service';
import { SearchUserRequest } from '../requests/search-user-request';
import { UpdateUserRequest } from '../requests/update-user-request';
import { Public, Roles } from 'src/auth/decorators/auth.decorator';
import { UserRole } from '../enums/user-role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async index(@Query() searchRequest: SearchUserRequest) {
    console.log(searchRequest);
    return await this.usersService.search(
      searchRequest.keyword,
      searchRequest.page,
      searchRequest.limit,
    );
  }

  @Public()
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() requestBody: CreateUserRequest,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    await this.usersService.create(requestBody, avatar);
  }

  @Get('/:id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.find(id);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateUserRequest,
    @UploadedFile() avatar: Express.Multer.File,
    @Request() request,
  ) {
    return await this.usersService.update(id, requestBody, avatar);
  }

  @Delete('/:id')
  @HttpCode(204)
  async destroy(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.delete(id);
  }
}
