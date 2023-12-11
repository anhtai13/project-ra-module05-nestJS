import { Product } from '../entities/product.entity';

export class ProductResponse {
  id: number;

  name: string;

  sku: string;

  category: number;

  description?: string;

  unitPrice: number;

  image?: string;

  createdAt: Date;

  created_by_id: number;

  updatedAt: Date;

  updated_by_id: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.sku = product.sku;
    this.category = product.category;
    this.description = product?.description;
    this.unitPrice = product.unit_price;
    this.image = product.image;
    this.createdAt = product.createdAt;
    this.created_by_id = product.created_by_id;
    this.updatedAt = product.updatedAt;
    this.updated_by_id = product.updated_by_id;
  }
}
