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
} from '@nestjs/common';
import { OrdersService } from '../providers/order.service';
import { SearchOrderRequest } from '../requests/search-order-request';
import { CreateOrderRequest } from '../requests/create-order-request';
import { UpdateOrderRequest } from '../requests/update-order-request';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async index(@Query() searchRequest: SearchOrderRequest) {
    return await this.ordersService.search(
      searchRequest.keyword,
      searchRequest.page,
      searchRequest.limit,
    );
  }

  @Post()
  @HttpCode(201)
  async create(@Body() requestBody: CreateOrderRequest) {
    await this.ordersService.create(requestBody);
  }

  @Get('/:id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.find(id);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateOrderRequest,
  ) {
    return await this.ordersService.update(id, requestBody);
  }

  @Delete('/:id')
  @HttpCode(204)
  async destroy(@Param('id', ParseIntPipe) id: number) {
    await this.ordersService.delete(id);
  }
}
