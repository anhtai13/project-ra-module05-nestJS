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
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
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
    authID: number,
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
      product.image = imagePath;
      product.unit_price = createProduct.unit_price;
      product.created_by_id = authID;
      product.updated_by_id = authID;
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
    image: Express.Multer.File,
    authId: number,
  ): Promise<void> {
    const product: Product = await this.productRepository.findOneBy({ id });

    // Kiểm tra sản phẩm có tồn tại hay không ?
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let imageLocation: string | null = null;
    let imagePath: string | null = null;

    if (image) {
      // Xử lý ảnh nếu được cung cấp
      const imageExtension = getFileExtension(image.originalname);
      imagePath = `image/${updateProduct.name}.${imageExtension}`;
      imageLocation = `./public/${imagePath}`;

      // Ghi file vào thư mục lưu trữ
      fs.writeFileSync(imageLocation, image.buffer);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Cập nhật thông tin sản phẩm
      product.sku = updateProduct.sku || product.sku;
      product.name = updateProduct.name || product.name;
      product.category = updateProduct.category || product.category;
      product.description = updateProduct.description || product.description;
      product.unit_price = updateProduct.unit_price || product.unit_price;
      product.image = imagePath || product.image;
      product.updated_by_id = authId;

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      // Nếu có lỗi, xóa ảnh đã tạo (nếu có)
      if (imageLocation) {
        fs.rmSync(imageLocation);
      }

      throw err;
    } finally {
      await queryRunner.release();
    }
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
