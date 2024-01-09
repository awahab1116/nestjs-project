import { Controller, Post, Body, Request, Req } from '@nestjs/common';
import { PlaceOrderService } from './place-order/place-order.service';
import { StripeWebhookService } from './stripe-webhook/stripe-webhook.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { Public } from '../constant/customdecorator';
@Controller('order')
export class OrderController {
  constructor(
    private readonly placeOrderService: PlaceOrderService,
    private readonly stripeWebhookService: StripeWebhookService,
  ) {}

  @Post('place')
  createProduct(@Request() req, @Body() placeOrderDto: PlaceOrderDto) {
    return this.placeOrderService.placeOrder(req.user, placeOrderDto);
  }

  @Public()
  @Post('stripe-webhook')
  async stripeWebhook(@Body() stripeEvent: any) {
    console.log(stripeEvent.type);
    await this.stripeWebhookService.stripeEvent(stripeEvent);
    return true;
  }
}
