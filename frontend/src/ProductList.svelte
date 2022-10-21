<script lang="ts">
    import Button from "@smui/button/src/Button.svelte";
    import P from "@smui/common/elements/P.svelte";
    import DataTable, {
        Body,
        Cell,
        Head,
        Label,
        Row,
        SortValue,
    } from "@smui/data-table";
    import IconButton from "@smui/icon-button/src/IconButton.svelte";
    import {
        deleteProduct,
        getProductImageList,
        getProducts,
        GetProductsParams,
        ProductEntity,
        ProductImageEntity,
        SortOrderEnum,
    } from "./api";
    import { AXIOS_CONFIG } from "./constants";
    import CreateProduct from "./CreateProduct.svelte";

    type ProductEntityWithPhotoUrl = ProductEntity & { photoUrl: string };

    let createProductDialog: CreateProduct;
    let sort: keyof ProductEntityWithPhotoUrl = "expireDate";
    let sortDirection: Lowercase<keyof typeof SortValue> = SortValue.ASCENDING;

    const getProductImageUrl = (
        productId: string,
        productImages: ProductImageEntity[]
    ) =>
        `${AXIOS_CONFIG.baseURL}/product-image?productImageId=${
            productImages.find((pi) => pi.productId === productId)?._id
        }`;
    function handleSort() {
        loadProduct();
    }
    async function loadProduct(params?: GetProductsParams) {
        if (
            (!params && sortDirection === SortValue.NONE) ||
            sortDirection === SortValue.OTHER
        ) {
            params = {
                orderBy: [sort],
                orderDir: sortDirection as SortOrderEnum,
            };
        }
        const productsResponse = await getProducts(params, AXIOS_CONFIG);
        const productImageListResponse = await getProductImageList(
            AXIOS_CONFIG
        );
        const productImages = productImageListResponse.data;
        products = productsResponse.data.map((p) => ({
            ...p,
            photoUrl: getProductImageUrl(p._id, productImages),
        }));
    }
    let products: ProductEntityWithPhotoUrl[] = [];
    loadProduct();
</script>

<DataTable
    sortable
    bind:sort
    bind:sortDirection
    on:SMUIDataTable:sorted={handleSort}
    table$aria-label="Product List"
    style="max-width: 100%;"
>
    <Head>
        <Row>
            <Cell columnId="image" sortable={false}>
                <IconButton class="material-icons">arrow_upward</IconButton>
            </Cell>
            <Cell columnId="name">
                <IconButton class="material-icons">arrow_upward</IconButton>
                <Label>Name</Label>
            </Cell>
            <Cell columnId="ean" numeric>
                <IconButton class="material-icons">arrow_upward</IconButton>
                <Label>EAN</Label>
            </Cell>
            <Cell columnId="place">
                <IconButton class="material-icons">arrow_upward</IconButton>
                <Label>Place</Label>
            </Cell>
            <Cell columnId="expireDate">
                <IconButton class="material-icons">arrow_upward</IconButton>
                <Label>Expire Date</Label>
            </Cell>
            <Cell columnId="actions" sortable={false}>
                <Label>Actions</Label>
            </Cell>
        </Row>
    </Head>
    <Body>
        {#each products as product}
            <Row>
                <Cell>
                    <img
                        alt="d"
                        style="height: 10vh;"
                        id={`img-${product._id}`}
                        src={product.photoUrl}
                        on:error|preventDefault={() =>
                            (document.getElementById(
                                `img-${product._id}`
                            ).style.display = "none")}
                    />
                </Cell>
                <Cell>
                    {product.name}
                </Cell>
                <Cell>
                    {product.ean}
                </Cell>
                <Cell>
                    {product.place}</Cell
                >
                <Cell>
                    {new Date(product.expireDate).toLocaleDateString(
                        "de-DE"
                    )}</Cell
                >
                <Cell>
                    <IconButton
                        style="opacity: initial;"
                        class="material-icons icon-action"
                        on:click={() =>
                            deleteProduct(
                                { productId: product["_id"] },
                                AXIOS_CONFIG
                            ).then(() => loadProduct())}
                    >
                        delete
                    </IconButton>
                    <IconButton
                        style="opacity: initial;"
                        class="material-icons icon-action"
                        on:click={() => {
                            createProductDialog.open(product);
                        }}>edit</IconButton
                    >
                </Cell>
            </Row>
        {/each}
    </Body>
</DataTable>

<Button on:click={() => createProductDialog.open()}>create</Button>

<CreateProduct
    bind:this={createProductDialog}
    on:create={() => loadProduct()}
    on:update={() => loadProduct()}
/>
