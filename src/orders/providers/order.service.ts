import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderRequest } from '../requests/create-order-request';
import { Order } from '../entities/order.entity';
import { UpdateOrderRequest } from '../requests/update-order-request';
import { OrderResponse } from '../responses/order.response';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { OrderDetails } from '../entities/order_details.entity';
import { User } from 'src/users/entities/user.entity';

// Tài liệu: https://docs.nestjs.com/providers#services
@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderDetails)
    private orderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async search(
    keyword?: string,
    page?: number,
    limit?: number,
  ): Promise<[Order[], number]> {
    return await this.orderRepository.findAndCount({
      relations: { user: true },
      where: {
        user: {
          username: ILike(`%${keyword || ''}%`),
        },
      },
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  // async create(createOrder: any, authID: number): Promise<void> {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const order: Order = new Order();
  //     order.serialNumber = createOrder.serial_number;
  //     order.userId = authID;
  //     order.totalPrice = createOrder.total_price;
  //     order.status = createOrder.status;
  //     order.orderAt = createOrder.order_at;
  //     order.createdAt = createOrder.created_at;
  //     await queryRunner.manager.save(order);
  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();

  //     throw err;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async create(createOrder: CreateOrderRequest, userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let totalPrice = 0;
    let orderDetails: OrderDetails[] = [];
    for (const item of createOrder.cart) {
      const product = await this.productRepository.findOneBy({
        id: item.productId,
      });
      if (!product) {
        throw new NotFoundException();
      }
      const subTotalPrice = product.unit_price * item.quantity;
      totalPrice += subTotalPrice;

      const orderDetail = new OrderDetails();

      orderDetail.product_id = product.id;
      orderDetail.sku = product.sku;
      orderDetail.name = product.name;
      orderDetail.unitPrice = product.unit_price;
      orderDetail.quantity = item.quantity;
      orderDetail.subTotalPrice = subTotalPrice;

      orderDetails.push(orderDetail);
    }

    try {
      const order = new Order();
      order.id = createOrder.order_id;
      order.serialNumber = new Date().getTime();
      order.userId = userId;
      order.created_by_id = userId;
      order.updated_by_id = userId;
      order.orderAt = new Date();
      order.totalPrice = totalPrice;
      order.status = '1';
      await queryRunner.manager.save(order);
      for (const newOrderDetail of orderDetails) {
        newOrderDetail.order_id = order.id;
        await queryRunner.manager.save(newOrderDetail);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);

      await queryRunner.rollbackTransaction();

      throw new HttpException(
        'Error creating order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

  async showDetails(id: number): Promise<any> {
    const orderResult: OrderDetails[] =
      await this.orderDetailsRepository.findBy({ order_id: id });

    let orderImage = [];
    for (const orderDetails of orderResult) {
      const orderDetailsImage = await this.productRepository.findOneBy({
        id: orderDetails.product_id,
      });
      orderImage.push(orderDetailsImage.image);
    }

    return {
      orderResult: orderResult,
      orderImage: orderImage,
    };
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
