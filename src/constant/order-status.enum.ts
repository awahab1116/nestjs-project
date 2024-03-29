/**
 * Represents the possible status of an order.
 */
export enum OrderStatus {
  PAYMENT_PENDING = 'payment-pending',
  PAYMENT_PROCESSED = 'payment-processed',
  INITIALIZED = 'initialized',
  COMPLETED = 'confirmed',
  CANCELED = 'canceled',
}
