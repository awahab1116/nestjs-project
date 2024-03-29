import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../../entity/order.entity';
import { OrderStatus } from '../../../constant/order-status.enum';

/**
 * Updates the status of a processed order to "COMPLETED" and returns the updated order.
 * If the order is not successfully updated, the original processed order is returned.
 * @param processedOrder - The processed order to update.
 * @returns The updated order or the original processed order.
 */
@Injectable()
export class OrderConfirmedService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async orderconfirmed(processedOrder: Order): Promise<Order> {
    let updatedOrder = await this.orderRepository
      .createQueryBuilder()
      .update(Order)
      .set({ status: OrderStatus.COMPLETED })
      .where('id = :id', { id: processedOrder.id })
      .execute();

    if (updatedOrder.affected) {
      return this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .where('order.id = :orderId', { orderId: processedOrder.id })
        .getOne();
    }

    return processedOrder;
  }
}
