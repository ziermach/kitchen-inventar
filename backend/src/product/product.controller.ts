import { Body, Controller, Delete, Get, Patch, Post, Query, UploadedFile, UseInterceptors, Version } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { ProductImageService } from '../product-image/product-image.service';
import { GetProductsParams, ProductIdReqParam } from './class/params';
import { CreateProductDto, ProductEntity, UpdateProductDto } from './class/product';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller()
export class ProductController {
    constructor(private productService: ProductService, private productImageService: ProductImageService) { }

    @Get('product')
    @ApiOperation({
        summary: 'get one available products',
    })
    @ApiResponse({
        status: 200,
        description:
            'The response will be a JSON object and contains a list of products.',
        type: ProductEntity,
    })
    public async getProduct(@Query() getProductParams: ProductIdReqParam): Promise<ProductEntity> {
        return await this.productService.findOne(getProductParams);
    }

    @Get('products')
    @ApiOperation({
        summary: 'List available products',
    })
    @ApiResponse({
        status: 200,
        description:
            'The response will be a JSON object and contains a list of products.',
        type: [ProductEntity],
    })
    public async getProducts(@Query() getProductsParams?: GetProductsParams): Promise<ProductEntity[]> {
        return await this.productService.findAll(getProductsParams);
    }

    @Post('product')
    @Version('1')
    @ApiOperation({
        summary: 'add new products',
    })
    @ApiResponse({
        status: 200,
        description:
            'The response will be a JSON object of created product.',
        type: ProductEntity,
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './images',
        }),
    }))
    public async addProduct(@Body() createProdoctDto: CreateProductDto, @UploadedFile() image?: Express.Multer.File): Promise<ProductEntity> {
        if (image) {
            createProdoctDto.imageId = image.path;
        }
        return await this.productService.create(createProdoctDto);
    }

    @Patch('product')
    @ApiOperation({
        summary: 'update product by id',
    })
    @ApiResponse({
        status: 200,
    })
    public async updateProduct(@Body() updateProductDto: UpdateProductDto): Promise<void> {
        return await this.productService.update(updateProductDto);
    }


    @Delete('product')
    @ApiOperation({
        summary: 'delete product',
    })
    @ApiResponse({
        status: 200,
        description:
            'The response will be a JSON object and contains a paginated list of images.',
        type: [ProductEntity],
    })
    public async deleteProduct(@Body() params: ProductIdReqParam): Promise<ProductEntity> {
        const deleted = await this.productService.delete(params.productId);
        const productPhoto = await this.productImageService.findOne({ productId: params.productId });
        await this.productImageService.delete(productPhoto.id);
        return deleted;
    }
}
