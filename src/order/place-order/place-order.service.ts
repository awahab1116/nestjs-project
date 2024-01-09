import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Order } from '../../entity/order.entity';
import { PlaceOrderDto } from '../dto/place-order.dto';
import { UserReqData } from '../../interface/user-req-data/user-req-data.interface';
import { ViewProductService } from '../../product/view-product/view-product.service';
import { UserProfileService } from '../../auth/user-profile/user-profile.service';
import { OrderPaymentService } from '../order-payment/order-payment.service';
import { OrderStatus } from '../../constant/order-status.enum';
import {
  ProductIdsInvalidException,
  UserNotFoundException,
  OrderNotPlacedException,
} from '../../exception/errors.exception';
import { InjectQueue } from '@nestjs/bull';
import { ORDER_CONFIRMED_QUEUE } from '../../constant/customdecorator';

@Injectable()
export class PlaceOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectQueue(ORDER_CONFIRMED_QUEUE)
    private readonly orderConfirmedQueue: Queue,
    private readonly viewProductService: ViewProductService,
    private readonly userProfileService: UserProfileService,
    private readonly orderPaymentService: OrderPaymentService,
  ) {}

  async placeOrder(
    user: UserReqData,
    placeOrderDto: PlaceOrderDto,
  ): Promise<string> {
    const userProfile = await this.userProfileService.userProfile(user.id);

    if (!userProfile) {
      throw new UserNotFoundException();
    }

    const products = await this.viewProductService.findProducts(
      placeOrderDto.productIds,
    );

    if (!products.length) {
      throw new ProductIdsInvalidException();
    }

    let payment = await this.orderPaymentService.orderPayment(products);

    const order: Order = new Order();
    order.products = products;
    order.user = userProfile;
    order.totalAmount = payment.amount_total / 100;
    order.status = OrderStatus.PAYMENT_PENDING;
    order.checkoutSessionId = payment.id;
    order.createdAt = new Date();
    order.updatedAt = new Date();

    let orderPlaced = await this.orderRepository.save(order);

    if (!orderPlaced) {
      throw new OrderNotPlacedException();
    }

    // await this.orderConfirmedQueue.add(
    //   {
    //     orderPlaced,
    //   },
    //   { delay: 15000 }, // 3 seconds delayed
    // );

    return payment.url;
  }
}
