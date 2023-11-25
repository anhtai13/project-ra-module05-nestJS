import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequest } from '../requests/create-product-request';
import { Product } from '../entities/product.entity';
import { UpdateProductRequest } from '../requests/update-product-request';
import { ProductResponse } from '../responses/product.response';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchProductRequest } from '../requests/search-product-request';
import { getFileExtension } from 'src/utilites/upload.util';
import * as fs from 'fs';

// Tài liệu: https://docs.nestjs.com/providers#services
@Injectable()
export class ProductsService {
  private static products: Array<Product> = [];
  private dataSource: DataSource;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async search(
    searchRequest: SearchProductRequest,
  ): Promise<[ProductResponse[], number]> {
    const [products, count] = await this.productRepository.findAndCount({
      where: [
        { name: ILike(`%${searchRequest.keyword || ''}%`) },
        { sku: ILike(`%${searchRequest.keyword || ''}%`) },
        { description: ILike(`%${searchRequest.keyword || ''}%`) },
      ],
      order: { id: 'DESC' }, // ORDER BY
      take: searchRequest.limit, // Tương đương LIMIT
      skip: searchRequest.getOffset(), // Tương đương OFFSET
    });

    return [products.map((product) => new ProductResponse(product)), count];
  }

  // async searchA(
  //   searchRequest: SearchProductRequest,
  // ): Promise<[ProductResponse[], number]> {
  //   const keyword = `%${searchRequest.keyword || ''}%`;
  //   const [products, count] = await this.productRepository
  //     .createQueryBuilder('product')
  //     .where('product.name LIKE :keyword', { keyword })
  //     .orWhere('product.sku LIKE :keyword', { keyword })
  //     // .orderBy('product.id', 'DESC') // Sắp xếp theo id giảm dần
  //     .take(searchRequest.limit) // Giới hạn số lượng bản ghi trả về
  //     .skip(searchRequest.getOffset()) // Bỏ qua một số bản ghi
  //     .getManyAndCount(); // Lấy sản phẩm và tổng số lượng bản ghi phù hợp

  //   return [products, count];
  // }

  async create(
    createProduct: CreateProductRequest,
    image: Express.Multer.File,
  ): Promise<void> {
    let originalname: string | null = null;
    let path: string | null = null;
    let imageLocation: string | null = null;

    if (image) {
      originalname = image.originalname;
      path = image.path;
    }

    let imagePath = null;

    if (image) {
      const imageExtension = getFileExtension(originalname);
      imagePath = `image/${createProduct.name}.${imageExtension}`;
      imageLocation = `./public/${imagePath}`;

      // Ghi file vào thư mục lưu trữ
      fs.writeFileSync(imageLocation, image.buffer);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product: Product = new Product();
      product.sku = createProduct.sku;
      product.name = createProduct.name;
      product.category = createProduct.category;
      product.description = createProduct.description;
      product.unitPrice = createProduct.unitPrice;
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (imageLocation) {
        fs.rmSync(imageLocation);
      }

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async find(id: number): Promise<ProductResponse> {
    const product: Product = await this.productRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!product) {
      throw new NotFoundException();
    }

    return new ProductResponse(product);
  }

  async update(
    id: number,
    updateProduct: UpdateProductRequest,
  ): Promise<ProductResponse> {
    const product: Product = await this.productRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!product) {
      throw new NotFoundException();
    }

    await this.productRepository.update({ id: id }, updateProduct);

    return await this.find(id);
  }

  async delete(id: number): Promise<void> {
    const product: Product = await this.productRepository.findOneBy({ id });

    // Kiểm tra người dùng có tồn tại hay không ?
    if (!product) {
      throw new NotFoundException();
    }

    this.productRepository.softRemove({ id });
  }
}
