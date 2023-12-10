import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderRequest } from '../requests/create-order-request';
import { Order } from '../entities/order.entity';
import { UpdateOrderRequest } from '../requests/update-order-request';
import { OrderResponse } from '../responses/order.response';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// Tài liệu: https://docs.nestjs.com/providers#services
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  async search(
    keyword?: string,
    page?: number,
    limit?: number,
  ): Promise<[Order[], number]> {
    return await this.orderRepository.findAndCount({
      relations: {},
      where: {
        serialNumber: ILike(`%${keyword || ''}%`),
      },
      order: { id: 'DESC' }, // ORDER BY
      take: 5, // Tương đương LIMIT
      skip: 0, // Tương đương OFFSET
    });
  }

  async create(createOrder: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order: Order = new Order();
      order.serialNumber = createOrder.serial_number;
      order.userId = createOrder.user_id;
      order.totalPrice = createOrder.total_price;
      order.status = createOrder.status;
      order.orderAt = createOrder.order_at;
      order.createdAt = createOrder.created_at;
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async find(id: number): Promise<OrderResponse> {
    const order: Order = await this.orderRepository.findOneBy({ id });

    // Kiểm tra đơn hàng có tồn tại hay không ?
    if (!order) {
      throw new NotFoundException();
    }

    return new OrderResponse(order);
  }

  async update(
    id: number,
    orderUpdate: UpdateOrderRequest,
  ): Promise<OrderResponse> {
    const order: Order = await this.orderRepository.findOneBy({ id });

    // Kiểm tra đơn hàng có tồn tại hay không ?
    if (!order) {
      throw new NotFoundException();
    }

    await this.orderRepository.update({ id: id }, orderUpdate);

    return await this.find(id);
  }

  async delete(id: number): Promise<void> {
    const order: Order = await this.orderRepository.findOneBy({ id });

    // Kiểm tra đơn hàng có tồn tại hay không ?
    if (!order) {
      throw new NotFoundException();
    }

    this.orderRepository.softRemove({ id });
  }
}
