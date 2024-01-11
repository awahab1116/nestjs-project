import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../../entity/order.entity';
import { OrderNotFound } from '../../../exception/errors.exception';

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
