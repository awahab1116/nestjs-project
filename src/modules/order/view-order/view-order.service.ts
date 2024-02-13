import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../../entity/order.entity';
import { OrderNotFound } from '../../../exception/errors.exception';

/**
 * Retrieves and returns the order with the specified orderId for the user with the specified userId.
 * Throws an OrderNotFound error if the order does not exist.
 *
 * @param userId - The ID of the user
 * @param orderId - The ID of the order
 * @returns A Promise that resolves to the retrieved order
 * @throws OrderNotFound error if the order does not exist
 */
@Injectable()
export class ViewOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async viewOrder(userId: number, orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        user: {
          id: userId,
        },
      },
    });

    if (!order) {
      throw new OrderNotFound();
    }

    return order;
  }
}
