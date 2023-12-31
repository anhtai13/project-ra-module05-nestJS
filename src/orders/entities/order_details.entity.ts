import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order_details')
export class OrderDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  order_id: number;

  @Column({ name: 'product_id' })
  product_id: number;

  @Column({ name: 'sku', type: 'varchar', length: 10 })
  sku: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'unit_price', type: 'decimal' })
  unitPrice: number;

  @Column({ name: 'quantity', type: 'decimal' })
  quantity: number;

  @Column({ name: 'sub_total_price', type: 'decimal' })
  subTotalPrice: number;
}
