import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceOrderService } from './place-order/place-order.service';
import { OrderController } from './order.controller';
import { Order } from '../../entity/order.entity';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { ORDER_CONFIRMED_QUEUE } from '../../constant/customdecorator';
import { OrderConfirmedConsumer } from './order-confirmed.consumer';
import { OrderConfirmedService } from './order-confirmed/order-confirmed.service';
import { GatewayModule } from '../../gateway/gateway.module';
import { OrderPaymentService } from './order-payment/order-payment.service';
import { StripeWebhookService } from './stripe-webhook/stripe-webhook.service';
import { ViewOrderService } from './view-order/view-order.service';

/**
 * Represents the Order module of the e-commerce backend.
 * This module is responsible for handling orders and related functionality.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Order]),
    ProductModule,
    AuthModule,
    GatewayModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: ORDER_CONFIRMED_QUEUE,
    }),
  ],
  providers: [
    PlaceOrderService,
    OrderConfirmedConsumer,
    OrderConfirmedService,
    OrderPaymentService,
    StripeWebhookService,
    ViewOrderService,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
