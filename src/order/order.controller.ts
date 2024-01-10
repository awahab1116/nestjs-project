import { Controller, Post, Body, Request, Get, Param } from '@nestjs/common';
import { PlaceOrderService } from './place-order/place-order.service';
import { StripeWebhookService } from './stripe-webhook/stripe-webhook.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { Public } from '../constant/customdecorator';
import { ViewOrderService } from './view-order/view-order.service';
@Controller('order')
export class OrderController {
  constructor(
    private readonly placeOrderService: PlaceOrderService,
    private readonly stripeWebhookService: StripeWebhookService,
    private readonly viewOrderService: ViewOrderService,
  ) {}

  @Post('place')
  createProduct(@Request() req, @Body() placeOrderDto: PlaceOrderDto) {
    return this.placeOrderService.placeOrder(req.user, placeOrderDto);
  }

  @Get('view/:id')
  viewOrder(@Request() req, @Param('id') id: string) {
    return this.viewOrderService.viewOrder(req.user.id, +id);
  }

  @Public()
  @Post('stripe-webhook')
  async stripeWebhook(@Body() stripeEvent: any) {
    console.log(stripeEvent.type);
    await this.stripeWebhookService.stripeEvent(stripeEvent);
    return true;
  }
}
