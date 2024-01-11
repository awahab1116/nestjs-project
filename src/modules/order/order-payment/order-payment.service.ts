import { Injectable } from '@nestjs/common';
const stripe = require('stripe')(
  'sk_test_51OURs9HQYjcX108K5jyFXpgvHODtusi32cIeatyiK5HTzOiy31hYF6NtxjDmGeyEbxOro4fGv47HHEsVSreABCEQ00LpUpdktK',
);
import Stripe from 'stripe';
// import { stripe } from '../../constant/stripe';
import { Product } from '../../../entity/product.entity';
import { Order } from '../../../entity/order.entity';

@Injectable()
export class OrderPaymentService {
  async lineItemProducts(products: Product[]) {
    const lineItems = products.map((product) => {
      return {
        price_data: {
          currency: process.env.STRIPE_PAYMENT_CURRENCY,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: Math.floor(product.price * 100) + '',
        },
        quantity: 1,
      };
    });

    return lineItems;
  }

  async orderPayment(
    products: Product[],
    orderPlaced: Order,
  ): Promise<Stripe.Checkout.Session> {
    const lineItems = await this.lineItemProducts(products);
    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        line_items: lineItems,
        payment_intent_data: {
          capture_method: process.env.STRIPE_CAPTURE_METHOD,
        },
        mode: process.env.STRIPE_PAYMENT_MODE,
        success_url: `${process.env.STRIPE_SUCCESS_URL_FIRST_PART}/${orderPlaced.id}/${process.env.STRIPE_SUCCESS_URL_SECOND_PART}`,
        cancel_url: process.env.STRIPE_FAILURE_URL,
      });
    return session;
  }
}
