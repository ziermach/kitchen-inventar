import { BadRequestException, HttpCode, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetProductsParams, ProductIdReqParam } from './class/params';
import { getMogoseSortConfig } from '../utility/sort-helper';
import { CreateProductDto, Product, ProductDocument, ProductEntity, UpdateProductDto } from './class/product';
import { ProductImageService } from '../product-image/product-image.service';


@Injectable()
export class ProductService {

    constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    ) { }

    async update(updateProductDto: UpdateProductDto): Promise<void> {
        try {
            const product = await this.productModel.findById(updateProductDto.productId).exec() as ProductEntity;
            if (!product) {
                throw new NotFoundException(`can't find product by id ${updateProductDto.productId}`);
            }
            await this.productModel.updateOne({ _id: updateProductDto.productId }, {
                ean: updateProductDto.ean,
                place: updateProductDto.place,
                expireDate: updateProductDto.expireDate,
                name: updateProductDto.name
            });
            return;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
        try {
            const createdProduct = await this.productModel.create({
                ean: createProductDto.ean,
                place: createProductDto.place,
                expireDate: createProductDto.expireDate,
                name: createProductDto.name,
                imageId: createProductDto.imageId
            });
            return await this.productModel.findById(createdProduct._id).exec() as ProductEntity;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
    async findAll(getProductsParams?: GetProductsParams): Promise<ProductEntity[]> {
        try {
            let orderBy = null;
            if (getProductsParams.orderBy && getProductsParams.orderDir) {
                orderBy = getMogoseSortConfig(getProductsParams.orderBy, getProductsParams.orderDir)
            }
            return await this.productModel.find().sort(orderBy).exec() as ProductEntity[];
        } catch (error) {
            throw new BadRequestException(error);
        }
    }


    async findOne(getProductParams: ProductIdReqParam): Promise<ProductEntity> {
        try {
            const product = await this.productModel.findById(getProductParams.productId).exec() as ProductEntity;
            if (!product) {
                throw new NotFoundException(`can't find product by id ${getProductParams.productId}`);
            }
            return product;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async delete(id: string) {
        try {
            return await this.productModel
                .findByIdAndRemove({ _id: id })
                .exec();
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
