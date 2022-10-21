import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ProductImageModule } from './product-image/product-image.module';
import { ProductModule } from './product/product.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'debug', 'log', 'verbose',],

  });

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
    include: [
      ProductModule,
      ProductImageModule
    ],
  };
  const config = new DocumentBuilder()
    .setTitle('Kitchen Inventar')
    .setDescription('Inventar of kitchen')
    .setVersion('1.0')
    .addTag('product')
    .addTag('product-image')
    .build();
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  /**
  * Enable CORS middleware
  */
  app.enableCors();
  await app.listen(3000);
}
bootstrap();