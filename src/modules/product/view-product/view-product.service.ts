import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OrderNotPlacedException,
  ProductIdsInvalidException,
  ProductOutOfStockException,
} from '../../../exception/errors.exception';
import { Product } from '../../../entity/product.entity';
import { PlaceOrderDto } from 'src/modules/order/dto/place-order.dto';

interface productsData {
  productId: number;
  quantity: number;
}

@Injectable()
export class ViewProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findProductsToPlaceOrder(productsData: PlaceOrderDto[]): Promise<{
    result: Product[];
    totalPriceSum: number;
    allProductsAvailable: Product[];
  }> {
    const allProductsAvailable =
      await this.checkProductAvailability(productsData);
    if (!allProductsAvailable.length) {
      throw new ProductOutOfStockException();
    }
    const productsUpdated = await this.updateProductQuantity(productsData);

    if (!productsUpdated.length) {
      throw new OrderNotPlacedException();
    }

    const totalPriceSum = allProductsAvailable.reduce((sum, product) => {
      return sum + +product.price * product.quantity;
    }, 0);

    return {
      result: productsUpdated,
      totalPriceSum,
      allProductsAvailable,
    };
  }

  async checkProductAvailability(
    productsData: productsData[],
  ): Promise<Product[]> {
    let obj: any[] = [];
    let productIds = productsData.map((product) => product.productId);

    const products = await this.productRepository.find({
      where: {
        id: In(productIds),
      },
    });

    if (products.length !== productsData.length) {
      throw new ProductIdsInvalidException();
    }

    for (let i = 0; i < productsData.length; i++) {
      const foundProduct = products.find(
        (product) =>
          product.id == productsData[i].productId &&
          productsData[i].quantity <= product.quantity,
      );

      if (!foundProduct) {
        throw new ProductOutOfStockException();
      }

      foundProduct.quantity = productsData[i].quantity;

      obj.push(foundProduct);
    }

    return obj;
  }

  async updateProductQuantity(
    updateProductQuantity: productsData[],
  ): Promise<Product[]> {
    const promises = updateProductQuantity.map(async (obj) => {
      const product = await this.productRepository.findOne({
        where: {
          id: obj.productId,
        },
      });

      if (!product) {
        throw new ProductIdsInvalidException();
      }
      product.quantity -= obj.quantity;

      const updatedProductObj = await this.productRepository.save(product);
      return updatedProductObj;
    });

    const updatedProducts = await Promise.all(promises);

    return updatedProducts;
  }

  async viewProduct(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
