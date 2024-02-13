import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class PlaceOrderDto {
  @IsNotEmpty({ message: 'productId is required.' })
  @IsInt({ message: 'productId must be an integer.' })
  productId: number;

  @IsNotEmpty({ message: 'quantity is required.' })
  @IsInt({ message: 'quantity must be an integer.' })
  @IsPositive({ message: 'quantity must be a positive integer.' })
  quantity: number;
}
