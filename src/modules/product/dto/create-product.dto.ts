import {
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Product name must have atleast 5 characters.' })
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be greater than 0' })
  quantity: number;

  @IsNotEmpty()
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be greater than 0' })
  price: number;
}
