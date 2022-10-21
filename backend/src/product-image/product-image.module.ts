import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductImage, ProductImageSchema } from './class/product-image';
import { ProductImageController } from './product-image.controller';
import { ProductImageService } from './product-image.service';

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService],
  imports: [MongooseModule.forFeature([{ name: ProductImage.name, schema: ProductImageSchema }])],
  exports: [ProductImageService],
})
export class ProductImageModule { }
