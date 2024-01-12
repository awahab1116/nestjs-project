import { IsInt, IsPositive } from 'class-validator';

export class PlaceOrderDto {
  @IsInt({ message: 'productId must be an integer.' })
  productId: number;

  @IsInt({ message: 'quantity must be an integer.' })
  @IsPositive({ message: 'quantity must be a positive integer.' })
  quantity: number;
}
