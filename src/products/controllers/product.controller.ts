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
  UseInterceptors,
} from '@nestjs/common';
import { CreateProductRequest } from '../requests/create-product-request';
import { ProductsService } from '../providers/product.service';
import { SearchProductRequest } from '../requests/search-product-request';
import { UpdateProductRequest } from '../requests/update-product-request';
import { FileInterceptor } from '@nestjs/platform-express';
import { request } from 'http';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async index(@Query() searchRequest: SearchProductRequest) {
    return await this.productsService.search(searchRequest);
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() requestBody: CreateProductRequest,
    @UploadedFile() image: Express.Multer.File,
    @Request() request,
  ) {
    await this.productsService.create(requestBody, image, request['user'].sub);
  }

  @Get('/:id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.find(id);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateProductRequest,
    @UploadedFile() image: Express.Multer.File,
    @Request() request,
  ) {
    return await this.productsService.update(id, requestBody, image, request['user'].sub);
  }

  @Delete('/:id')
  @HttpCode(204)
  async destroy(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.delete(id);
  }
}
