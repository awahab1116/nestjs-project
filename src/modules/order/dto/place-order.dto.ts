import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for placing an order.
 */
export class PlaceOrderDto {
  /**
   * The ID of the product to be ordered.
   * @example 1
   */
  @IsNotEmpty({ message: 'productId is required.' })
  @IsInt({ message: 'productId must be an integer.' })
  productId: number;

  /**
   * The quantity of the product to be ordered.
   * @example 5
   */
  @IsNotEmpty({ message: 'quantity is required.' })
  @IsInt({ message: 'quantity must be an integer.' })
  @IsPositive({ message: 'quantity must be a positive integer.' })
  quantity: number;
}
