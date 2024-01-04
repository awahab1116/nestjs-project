import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entity/product.entity';

@Injectable()
export class ViewProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async viewProduct(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findProducts(productIds: number[]): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        id: In(productIds),
      },
    });
  }
}
