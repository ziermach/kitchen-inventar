import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';

export interface ProductImageInterface {
    productId?: string
    fieldname?: string;
    originalname?: string;
    mimetype?: string;
    destination?: string;
    filename?: string;
    path?: string;
    size?: number;
    encoding?: string
}

export type ProductImageDocument = ProductImage & Document;

@Schema({ timestamps: true })
export class ProductImage implements ProductImageInterface {

    @Prop({ type: String, required: true, unique: true })
    productId: string

    @Prop({ type: String, required: true })
    fieldname: string;

    @Prop({ type: String, required: true })
    originalname: string;

    @Prop({ type: String, required: true })
    mimetype: string;

    @Prop({ type: String, required: true })
    destination: string;

    @Prop({ type: String, required: true })
    filename: string;

    @Prop({ type: String, required: true })
    path: string;

    @Prop({ type: Number, required: true })
    size: number;

    @Prop({ type: String, required: false })
    encoding?: string

}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

export class CreateProductImageDto {
    productId: string;

    fieldname: string;

    originalname: string;

    mimetype: string;

    destination: string;

    filename: string;

    path: string;

    size: number;

    encoding?: string
}

export class UploadProductImageDto {
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image: Express.Multer.File;

    @ApiProperty({ type: 'string', required: true })
    productId: string;
}

export class ProductImageEntity implements ProductImageInterface {


    @ApiProperty({ example: '123123', required: true })
    _id: string;

    @ApiProperty({ example: '123123', required: true })
    productId: string;

    @ApiProperty({ example: 'image' })
    fieldname: string;

    @ApiProperty({ example: 'fooobar' })
    originalname: string;

    @ApiProperty({ example: 'image/jpeg' })
    mimetype: string;

    @ApiProperty({ example: './file' })
    destination: string;

    @ApiProperty({ example: 'MyFile' })
    filename: string;

    @ApiProperty({ example: './file/MyFile' })
    path: string;

    @ApiProperty({ example: 123123 })
    size: number;

    @ApiProperty({ example: '7bit' })
    encoding?: string


}