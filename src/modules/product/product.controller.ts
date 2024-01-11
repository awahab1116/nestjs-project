import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateProductService } from './create-product/create-product.service';
import { ViewProductService } from './view-product/view-product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly viewProductService: ViewProductService,
  ) {}

  @Post('create')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.createProductService.createProduct(createProductDto);
  }

  @Get('view')
  viewProducts() {
    return this.viewProductService.viewProduct();
  }
}
