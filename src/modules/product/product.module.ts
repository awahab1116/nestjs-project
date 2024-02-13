import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProductService } from './create-product/create-product.service';
import { ViewProductService } from './view-product/view-product.service';
import { ProductController } from './product.controller';
import { Product } from '../../entity/product.entity';

/**
 * Module for managing products.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [CreateProductService, ViewProductService],
  controllers: [ProductController],
  exports: [ViewProductService],
})
export class ProductModule {}
