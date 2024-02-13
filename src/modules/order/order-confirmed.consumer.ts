import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';
import { ORDER_CONFIRMED_QUEUE } from '../../constant/customdecorator';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { OrderConfirmedService } from './order-confirmed/order-confirmed.service';
import { SocketService } from '../../gateway/gateway.service';
import { Order } from '../../entity/order.entity';

/**
 * Consumer class for processing order confirmed messages.
 */
@Processor(ORDER_CONFIRMED_QUEUE)
export class OrderConfirmedConsumer {
  private readonly logger = new Logger(OrderConfirmedConsumer.name);

  /**
   * Constructs a new instance of the OrderConfirmedConsumer class.
   * @param orderconfirmedService - The service for handling order confirmed logic.
   * @param socketService - The service for handling socket communication.
   */
  constructor(
    private readonly orderconfirmedService: OrderConfirmedService,
    private readonly socketService: SocketService,
  ) {}

  /**
   * Event handler for when a queue job is completed.
   * Sends an order status message to the socket service.
   * @param job - The completed job.
   * @param result - The result of the completed job.
   */
  @OnQueueCompleted()
  onComplete(job: Job, result: Order) {
    this.socketService.orderStatusMessage(result);
  }

  /**
   * Process function for handling order confirmed jobs.
   * Logs the job data and calls the order confirmed service.
   * @param job - The job containing the updated order data.
   * @returns The updated order.
   */
  @Process()
  async orderConfirmed(job: Job<{ updatedOrder: Order }>) {
    this.logger.log(JSON.stringify(job.data));
    let order = await this.orderconfirmedService.orderconfirmed(
      job.data.updatedOrder,
    );
    return order;
  }
}
