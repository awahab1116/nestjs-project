import { Controller, Post, Body, Request, Req } from '@nestjs/common';
import { PlaceOrderService } from './place-order/place-order.service';
import { PlaceOrderDto } from './dto/place-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly placeOrderService: PlaceOrderService) {}

  @Post('place')
  createProduct(@Request() req, @Body() placeOrderDto: PlaceOrderDto) {
    return this.placeOrderService.placeOrder(req.user, placeOrderDto);
  }
}
