import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductImageModule } from './product-image/product-image.module';
import { ProductModule } from './product/product.module';



@Module({
  imports: [ProductModule, ProductImageModule, MongooseModule.forRoot('mongodb://localhost/kitchen-inventar')],
})
export class AppModule { }
