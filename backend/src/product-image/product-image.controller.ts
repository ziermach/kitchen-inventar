import { Body, Controller, Delete, Get, Post, Query, Res, StreamableFile, UploadedFile, UseInterceptors, Version } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UploadProductImageDto, ProductImageEntity, CreateProductImageDto } from './class/product-image';
import { ProductImageService } from './product-image.service';
import type { Response } from 'express';
import { GetProductImageQueryParams } from '../product/class/product';
import { ProductImageIdReqParam } from './class/params';
import { randomUUID } from 'crypto';

@ApiTags('product-image')
@Controller('product-image')
export class ProductImageController {


    constructor(private productImageService: ProductImageService) { }

    @Post()
    // @Version('1')
    @ApiOperation({
        summary: 'add new product image',
    })
    @ApiResponse({
        status: 200,
        description:
            'The response will be a JSON object of created product-image (meta-data).',
        type: ProductImageEntity,
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './images',
        }),
    }))
    public async addProductImage(@Body() uploadProdoctImageDto: UploadProductImageDto, @UploadedFile() image: Express.Multer.File): Promise<ProductImageEntity> {
        const createProdoctImageDto: CreateProductImageDto = {
            ...image,
            productId: uploadProdoctImageDto.productId,
        }
        return await this.productImageService.create(createProdoctImageDto);
    }


    @Get()
    @ApiOperation({
        summary: 'download product image',
    })
    @ApiResponse({
        status: 200,
        description:
            'The response will be a file stream',
        type: StreamableFile,
    })
    async getProductImage(@Query() params: GetProductImageQueryParams, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
        const productImage = await this.productImageService.findOne(params);
        const file = createReadStream(join(process.cwd(), productImage.path));
        res.set({
            'Content-Type': productImage.mimetype,
            'Content-Disposition': `attachment; filename="${productImage.originalname}"`,
        });
        return new StreamableFile(file);
    }

    @Get('list')
    @ApiOperation({
        summary: 'get product image list',
    })
    @ApiResponse({
        status: 200,
        description:
            'The response will be a file json object represeting a list of image meta data',
        type: [ProductImageEntity],
    })
    async getProductImageList(): Promise<ProductImageEntity[]> {
        return this.productImageService.findAll();
    }


    @Delete()
    @ApiOperation({
        summary: 'delete product image by id',
    })
    @ApiResponse({
        status: 200,
        description:
            'The response will be a file json object represeting a list of image meta data',
        type: ProductImageEntity,
    })
    async deleteProductImage(@Query() params: ProductImageIdReqParam): Promise<ProductImageEntity> {
        return this.productImageService.delete(params.productImageId);
    }

}
