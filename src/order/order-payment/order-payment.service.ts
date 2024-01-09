import { Injectable } from '@nestjs/common';
const stripe = require('stripe')(
  'sk_test_51OURs9HQYjcX108K5jyFXpgvHODtusi32cIeatyiK5HTzOiy31hYF6NtxjDmGeyEbxOro4fGv47HHEsVSreABCEQ00LpUpdktK',
);
import { Order } from '../../entity/order.entity';

@Injectable()
export class OrderPaymentService {
  async orderPayment(): Promise<any> {
    console.log(process.env.TOKEN_SECRET);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Stripe payment',
            },
            unit_amount: '2000',
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        capture_method: 'automatic',
        metadata: {
          data: 'hello',
        },
      },
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_FAILURE_URL,
    });
    return session;
  }
}
