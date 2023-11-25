import { Order } from '../entities/order.entity';

export class OrderResponse {
  id: number;

  serialNumber: number;

  userId: number;

  orderAt: Date;

  totalPrice: number;

  status: string;

  note?: string;

  constructor(order: Order) {
    this.id = order.id;
    this.serialNumber = order.serialNumber;
    this.userId = order.userId;
    this.orderAt = order.orderAt;
    this.totalPrice = order.totalPrice;
    this.status = order.status;
    this.note = order.note;
  }
}
