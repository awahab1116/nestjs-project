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
    console.log('2');
    if (!allProductsAvailable.length) {
      throw new ProductOutOfStockException();
    }
    console.log('3');
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
      console.log('4');
      const product = await this.productRepository.findOne({
        where: {
          id: obj.productId,
        },
      });

      if (!product) {
        throw new ProductIdsInvalidException();
      }
      console.log('5');
      product.quantity -= obj.quantity;

      const updatedProductObj = await this.productRepository.save(product);
      console.log('Product is ', updatedProductObj);
      console.log('6');
      return updatedProductObj;
    });

    const updatedProducts = await Promise.all(promises);

    return updatedProducts;
  }

  async viewProduct(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
