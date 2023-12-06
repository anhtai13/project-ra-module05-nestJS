import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'serial_number', type: 'varchar', length: '255' })
  serialNumber: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'order_at', type: 'datetime' })
  orderAt: Date;

  @Column({ name: 'total_price', type: 'decimal' })
  totalPrice: number;

  @Column({ name: 'status', type: 'tinyint' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt?: Date;
}
