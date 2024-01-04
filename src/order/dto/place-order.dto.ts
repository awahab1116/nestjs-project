import {
  IsOptional,
  IsInt,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  Min,
} from 'class-validator';

export class PlaceOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({
    each: true,
    message: 'Each element in productIds must be an integer.',
  })
  productIds: number[];
}
