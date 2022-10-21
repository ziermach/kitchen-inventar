
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';

export interface ProductInterface {
    name?: string;
    ean?: number;
    place?: KITCHEN_PLACE;
    expireDate?: Date;
    imageId?: string;
}

export enum KITCHEN_PLACE {
    FREEZER = "freezer",
    FRIDGE = "fridge",
    STORAGE_CABINET = "storage cabinet",
    OTHER = "other",
}


export class ProductEntity implements ProductInterface {
    @ApiProperty({ example: '123123' })
    _id: string;
    @ApiProperty({ example: 'Cheese' })
    name: string;
    @ApiProperty({ example: 12356 })
    ean: number;
    @ApiProperty({
        example: KITCHEN_PLACE.FREEZER, enum: KITCHEN_PLACE,
        enumName: 'KitchenPlaceEnum',
    })
    place: KITCHEN_PLACE;
    @ApiProperty()
    expireDate: Date;
    @ApiProperty({ required: false })
    imageId?: string;

}

export class GetProductImageQueryParams {
    @ApiProperty({ type: String, required: false })
    productId?: string
    @ApiProperty({ type: String, required: false })
    productImageId?: string
}


export class UpdateProductDto implements ProductInterface {
    @ApiProperty({ type: String, required: true })
    productId: string;

    @ApiProperty({ type: Number, required: false })
    ean?: number;

    @ApiProperty({ type: String, required: false, enum: KITCHEN_PLACE, enumName: 'KitchenPlace' })
    place?: KITCHEN_PLACE;

    @ApiProperty({ type: Date, required: false })
    expireDate?: Date;

    @ApiProperty({ type: String, required: false })
    name?: string;

    @ApiProperty({ type: 'string', required: false })
    imageId: string;
}


export class CreateProductDto implements ProductInterface {
    @ApiProperty({ type: Number, required: true })
    ean: number;

    @ApiProperty({ type: String, required: true, enum: KITCHEN_PLACE, enumName: 'KitchenPlace' })
    place: KITCHEN_PLACE;

    @ApiProperty({ type: Date, required: true, default: new Date() })
    expireDate: Date;

    @ApiProperty({ type: String, required: true, default: 'Cheese' })
    name: string;

    @ApiProperty({ required: false })
    imageId?: string;
}


export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product implements ProductInterface {
    @Prop({ type: Number, required: true })
    ean: number;
    @Prop({ type: String, enum: KITCHEN_PLACE, required: true })
    place: KITCHEN_PLACE;
    @Prop({ type: Date, required: true })
    expireDate: Date;
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, required: false })
    imageId?: string;
}




export const ProductSchema = SchemaFactory.createForClass(Product);