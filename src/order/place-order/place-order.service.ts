import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Order } from '../../entity/order.entity';
import { PlaceOrderDto } from '../dto/place-order.dto';
import { UserReqData } from '../../interface/user-req-data/user-req-data.interface';
import { ViewProductService } from '../../product/view-product/view-product.service';
import { UserProfileService } from '../../auth/user-profile/user-profile.service';
import { OrderStatus } from '../../constant/order-status.enum';
import {
  productIdsInvalidException,
  UserNotFoundException,
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
  ) {}

  async placeOrder(
    user: UserReqData,
    placeOrderDto: PlaceOrderDto,
  ): Promise<Order> {
    const userProfile = await this.userProfileService.userProfile(user.id);

    if (!userProfile) {
      throw new UserNotFoundException();
    }

    const products = await this.viewProductService.findProducts(
      placeOrderDto.productIds,
    );

    if (!products.length) {
      throw new productIdsInvalidException();
    }

    const order: Order = new Order();
    order.products = products;
    order.user = userProfile;
    order.totalAmount = 1000;
    order.status = OrderStatus.PROCESSING;
    order.createdAt = new Date();
    order.updatedAt = new Date();

    let orderPlaced = await this.orderRepository.save(order);
    await this.orderConfirmedQueue.add(
      {
        orderPlaced,
      },
      { delay: 15000 }, // 3 seconds delayed
    );

    return orderPlaced;
  }
}
