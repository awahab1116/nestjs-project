import {
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
  Min,
} from 'class-validator';

/**
 * Data transfer object for creating a product.
 */
export class CreateProductDto {
  /**
   * The name of the product.
   * Must be a non-empty string with a minimum length of 5 characters.
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Product name must have atleast 5 characters.' })
  name: string;

  /**
   * The description of the product.
   * Optional field.
   */
  @IsString()
  @IsOptional()
  description: string;

  /**
   * The quantity of the product.
   * Optional field.
   * Must be a positive integer.
   */
  @IsOptional()
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be greater than 0' })
  quantity: number;

  /**
   * The price of the product.
   * Must be a positive integer.
   */
  @IsNotEmpty()
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be greater than 0' })
  price: number;
}
