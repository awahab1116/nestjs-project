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

/**
 * Service responsible for viewing and managing products.
 */
@Injectable()
export class ViewProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Finds products to place an order based on the provided data.
   * @param productsData - The data containing the product IDs and quantities.
   * @returns An object containing the result products, total price sum, and all available products.
   * @throws {ProductOutOfStockException} - If any of the requested products are out of stock.
   * @throws {OrderNotPlacedException} - If the order cannot be placed due to some error.
   */
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

  /**
   * Checks the availability of the requested products.
   * @param productsData - The data containing the product IDs and quantities.
   * @returns An array of available products.
   * @throws {ProductIdsInvalidException} - If any of the requested product IDs are invalid.
   * @throws {ProductOutOfStockException} - If any of the requested products are out of stock.
   */
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

  /**
   * Updates the quantity of the requested products.
   * @param updateProductQuantity - The data containing the product IDs and quantities to be updated.
   * @returns An array of updated products.
   * @throws {ProductIdsInvalidException} - If any of the requested product IDs are invalid.
   */
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

  /**
   * Retrieves all products.
   * @returns An array of products.
   */
  async viewProduct(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
