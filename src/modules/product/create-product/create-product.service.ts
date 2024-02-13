import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../../entity/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

/**
 * Creates a new product.
 * @param createProductDto - The data for creating the product.
 * @returns The created product.
 */
@Injectable()
export class CreateProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product: Product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.quantity = createProductDto.quantity;
    product.createdAt = new Date();
    product.updatedAt = new Date();
    return this.productRepository.save(product);
  }
}
