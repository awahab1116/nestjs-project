import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const ORDER_CONFIRMED_QUEUE = 'order-confirmed';
/**
 * Marks a route handler or controller method as public.
 * This decorator can be used to indicate that a particular route or controller method does not require authentication.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
