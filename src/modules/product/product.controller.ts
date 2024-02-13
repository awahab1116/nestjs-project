import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateProductService } from './create-product/create-product.service';
import { ViewProductService } from './view-product/view-product.service';
import { CreateProductDto } from './dto/create-product.dto';

/**
 * Controller for managing product operations.
 */
@Controller('product')
export class ProductController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly viewProductService: ViewProductService,
  ) {}

  /**
   * Endpoint for creating a new product.
   * @param createProductDto - The DTO containing the product details.
   * @returns The created product.
   */
  @Post('create')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.createProductService.createProduct(createProductDto);
  }

  /**
   * Endpoint for viewing all products.
   * @returns The list of products.
   */
  @Get('view')
  viewProducts() {
    return this.viewProductService.viewProduct();
  }
}
