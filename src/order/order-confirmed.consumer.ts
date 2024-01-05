import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';
import { ORDER_CONFIRMED_QUEUE } from '../constant/customdecorator';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { OrderConfirmedService } from './order-confirmed/order-confirmed.service';
import { SocketService } from '../gateway/gateway.service';
import { Order } from '../entity/order.entity';

@Processor(ORDER_CONFIRMED_QUEUE)
export class OrderConfirmedConsumer {
  private readonly logger = new Logger(OrderConfirmedConsumer.name);
  constructor(
    private readonly orderconfirmedService: OrderConfirmedService,
    private readonly socketService: SocketService,
  ) {}

  // onModuleInit() {
  //   this.logger.log('OrderConfirmedConsumer initialized');
  // }

  @OnQueueCompleted()
  onComplete(job: Job, result: Order) {
    this.socketService.orderStatusMessage(result);
    // this.appService.orderconfirmedCallback(result);
  }

  @Process()
  async orderConfirmed(job: Job<{ orderPlaced: Order }>) {
    this.logger.log(JSON.stringify(job.data));
    let order = await this.orderconfirmedService.orderconfirmed(
      job.data.orderPlaced,
    );
    return order;
    // await new Promise<void>((resolve) =>
    //   setTimeout(() => {
    //     this.logger.log(`Job id is ${job.id}`);
    //     if (job.data.callbackfunc) {
    //       job.data.callbackfunc();
    //     } else {
    //     }

    //     resolve();
    //   }, 15000),
    // );
    // Your job processing logic here
  }
}
