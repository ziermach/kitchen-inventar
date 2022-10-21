import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { GetProductImageQueryParams } from '../product/class/product';
import { ProductImage, ProductImageDocument, ProductImageEntity, CreateProductImageDto } from './class/product-image';

@Injectable()
export class ProductImageService {
    async findOne(params: GetProductImageQueryParams) {
        let findQuery: FilterQuery<ProductImageDocument> = {};
        if (params.productImageId) {
            findQuery._id = params.productImageId
        }
        if (params.productId) {
            findQuery.productId = params.productId
        }
        const foundImages = await this.productImageModel.find(findQuery);
        if (foundImages.length) {
            return foundImages[0];
        }
        throw new NotFoundException(`Could not find image by ${params.productId ? `productId = ${params.productId}` : ''} ${params.productImageId ? `productImageId = ${params.productImageId}` : ''}`)
    }

    async findAll() {
        return this.productImageModel.find();
    }

    async delete(id: string) {
        try {
            return await this.productImageModel
                .findByIdAndRemove({ _id: id })
                .exec();
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async create(createProductImageDto: CreateProductImageDto): Promise<ProductImageEntity> {
        try {
            const createdProductImage = await this.productImageModel.create(createProductImageDto);
            return await this.productImageModel.findById(createdProductImage._id).exec() as ProductImageEntity;
        } catch (error) {
            if (error && error.code === 11000) {
                throw new HttpException(`Duplicated product image for product ${createProductImageDto.productId} allready exists`, HttpStatus.BAD_REQUEST)
            }
            throw new BadRequestException(error);
        }
    }
    constructor(@InjectModel(ProductImage.name) private readonly productImageModel: Model<ProductImageDocument>,
    ) { }
}
