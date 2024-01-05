import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const ORDER_CONFIRMED_QUEUE = 'order-confirmed';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
