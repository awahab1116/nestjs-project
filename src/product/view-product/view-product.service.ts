import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductIdsInvalidException } from '../../exception/errors.exception';
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

  async findProducts(
    productIds: number[],
  ): Promise<{ result: Product[]; totalPriceSum: number }> {
    // const result = await this.productRepository
    //   .createQueryBuilder('product')
    //   .select('SUM(product.price)', 'sum')
    //   .where('product.id IN (:...productIds)', { productIds })
    //   // .where("product.id = :id", { id: 1 })
    //   .getRawMany();

    const result = await this.productRepository.find({
      where: {
        id: In(productIds),
      },
    });

    if (result.length !== productIds.length) {
      throw new ProductIdsInvalidException();
    }

    const totalPriceSum = result.reduce((sum, product) => {
      return sum + +product.price;
    }, 0);

    return {
      result,
      totalPriceSum,
    };
  }
}
