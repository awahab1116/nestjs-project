import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ORDER_CONFIRMED_QUEUE } from '../../../constant/customdecorator';
import { Order } from '../../../entity/order.entity';
import { Repository } from 'typeorm';
import { OrderNotFound } from '../../../exception/errors.exception';
import { OrderStatus } from '../../../constant/order-status.enum';

/**
 * Service responsible for handling Stripe webhook events.
 */
@Injectable()
export class StripeWebhookService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectQueue(ORDER_CONFIRMED_QUEUE)
    private readonly orderConfirmedQueue: Queue,
  ) {}

  /**
   * Handles the Stripe webhook event.
   * @param event - The Stripe event object.
   * @returns A boolean indicating the success of the operation.
   */
  async stripeEvent(event: any): Promise<boolean> {
    console.log('event is ', event);
    if (event.type === 'checkout.session.completed') {
      //update order and add the order to queue

      let checkoutSessionId = event.data.object.id;
      const order = await this.orderRepository.findOne({
        where: { checkoutSessionId },
      });

      if (!order) {
        throw new OrderNotFound(
          `Order with checkoutSessionId ${checkoutSessionId} not found`,
        );
      }

      order.status = OrderStatus.PAYMENT_PROCESSED;
      let updatedOrder = await this.orderRepository.save(order);

      await this.orderConfirmedQueue.add(
        {
          updatedOrder,
        },
        { delay: 15000 }, // 15 seconds delayed
      );

      console.log('Updated order is ', updatedOrder);
    }
    return true;
  }
}
