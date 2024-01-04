import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceOrderService } from './place-order/place-order.service';
import { OrderController } from './order.controller';
import { Order } from '../entity/order.entity';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProductModule, AuthModule, TypeOrmModule.forFeature([Order])],
  providers: [PlaceOrderService],
  controllers: [OrderController],
})
export class OrderModule {}
