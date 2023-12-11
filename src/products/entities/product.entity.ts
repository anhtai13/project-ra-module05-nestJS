import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'sku', type: 'varchar', length: 10, unique: true })
  sku: string;

  @Column({ name: 'category', type: 'varchar', length: 10 })
  category: number;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ name: 'unit_price', type: 'decimal' })
  unit_price: number;

  @Column({ name: 'image', type: 'varchar', length: 255, nullable: true })
  image?: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @Column({ name: 'created_by_id', type: 'integer' })
  created_by_id: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'updated_by_id', type: 'integer' })
  updated_by_id: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date;
}
