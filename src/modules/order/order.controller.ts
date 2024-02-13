import { Controller, Post, Body, Request, Get, Param } from '@nestjs/common';
import { PlaceOrderService } from './place-order/place-order.service';
import { StripeWebhookService } from './stripe-webhook/stripe-webhook.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { Public } from '../../constant/customdecorator';
import { ViewOrderService } from './view-order/view-order.service';
/**
 * Controller for handling order-related operations.
 */
@Controller('order')
export class OrderController {
  constructor(
    private readonly placeOrderService: PlaceOrderService,
    private readonly stripeWebhookService: StripeWebhookService,
    private readonly viewOrderService: ViewOrderService,
  ) {}

  /**
   * Endpoint for placing an order.
   * @param req - The request object.
   * @param placeOrderDto - The order details.
   * @returns The result of placing the order.
   */
  @Post('place')
  createProduct(@Request() req, @Body() placeOrderDto: PlaceOrderDto[]) {
    return this.placeOrderService.placeOrder(req.user, placeOrderDto);
  }

  /**
   * Endpoint for viewing an order.
   * @param req - The request object.
   * @param id - The ID of the order to view.
   * @returns The order details.
   */
  @Get('view/:id')
  viewOrder(@Request() req, @Param('id') id: string) {
    return this.viewOrderService.viewOrder(req.user.id, +id);
  }

  /**
   * Endpoint for handling Stripe webhook events.
   * @param stripeEvent - The Stripe event object.
   * @returns A boolean indicating the success of the operation.
   */
  @Public()
  @Post('stripe-webhook')
  async stripeWebhook(@Body() stripeEvent: any) {
    console.log(stripeEvent.type);
    await this.stripeWebhookService.stripeEvent(stripeEvent);
    return true;
  }
}
