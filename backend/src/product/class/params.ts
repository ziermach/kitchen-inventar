import { ApiProperty } from "@nestjs/swagger";
import { SortOrder } from "mongoose";

export class ProductIdReqParam {
    @ApiProperty({
        name: 'productId',
        type: String,
        description: 'The identifier of the product',
        example: '12345',
    })
    productId: string;
}

export enum SortOrderEnum {
    'asc', 'ascending', 'desc', 'descending'
}

export class GetProductsParams {
    @ApiProperty({
        name: 'orderBy',
        type: [String],
        description: 'orderBy by property',
        example: 'name',
        required: false,
    })
    orderBy?: string[];

    @ApiProperty({
        name: 'orderDir',
        type: String,
        enum: SortOrderEnum,
        enumName: 'SortOrderEnum',
        description: 'orderBy direction ("DESC|ASC")',
        required: false,
    })
    orderDir?: SortOrder
}