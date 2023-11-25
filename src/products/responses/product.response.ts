import { Product } from '../entities/product.entity';

export class ProductResponse {
  id: number;

  name: string;

  sku: string;

  category: string;

  description?: string;

  unitPrice: number;

  image?: string;

  createdAt: Date;

  createdById: number;

  updatedAt: Date;

  updatedById: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.sku = product.sku;
    this.category = product.category;
    this.description = product?.description;
    this.unitPrice = product.unitPrice;
    this.image = product?.image;
    this.createdAt = product.createdAt;
    this.createdById = product.createdById;
    this.updatedAt = product.updatedAt;
    this.updatedById = product.updatedById;
  }
}
