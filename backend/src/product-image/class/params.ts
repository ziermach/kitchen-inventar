import { ApiProperty } from "@nestjs/swagger";


export class ProductImageIdReqParam {
    @ApiProperty({
        name: 'productImageId',
        type: String,
        description: 'The identifier of the product image',
        example: '12345',
    })
    productImageId: string;
}
