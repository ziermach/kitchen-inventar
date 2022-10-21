<script lang="ts">
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import { DateInput } from "date-picker-svelte";
    import { createEventDispatcher } from "svelte";
    import { AXIOS_CONFIG } from "./constants";
    import Slide from "./Slide.svelte";
    import * as yup from "yup";
    import Select, { Option } from "@smui/select";
    import {
        addProduct,
        addProductImage,
        deleteProductImage,
        getProductImageList,
        KitchenPlaceEnum,
        ProductEntity,
        updateProduct,
        UpdateProductDto,
    } from "./api";
    import Photo from "./Camera.svelte";

    export const open = (editProduct?: ProductEntity) => {
        setIninital();
        createFirewallDialogOpen = true;
        isEdit = editProduct ? true : isEdit;
        newProduct = editProduct ? (editProduct as ProductEntity) : newProduct;
        expireDate = editProduct
            ? new Date(editProduct.expireDate)
            : expireDate;
    };
    export const close = () => {
        setIninital();
    };
    const dateFormat = "dd.MM.yyyy";
    const maxYearsInFuture = 20;
    const dispatch = createEventDispatcher<{ create; update }>();

    const productSchema = yup.object({
        _id: yup.string().nullable().notRequired(),
        name: yup.string().required(),
        ean: yup.number().required(),
        place: yup.string().oneOf(Object.keys(KitchenPlaceEnum)).required(),
        expireDate: yup.date().min(getMinDate()).max(getMaxDate()).required(),
    });

    let invalidMsg;
    let valid = false;
    let createProductForm;
    let photo: Photo;
    let image: string;
    let createFirewallDialogOpen;
    let isEdit;
    let isLoading;
    let newProduct: ProductEntity;
    let expireDate: Date;
    setIninital();
    function setIninital() {
        isEdit = false;
        createFirewallDialogOpen = false;
        isLoading = false;
        newProduct = {
            _id: null,
            name: null,
            ean: null,
            place: KitchenPlaceEnum.other,
            expireDate: new Date().toDateString(),
        };
        image = null;
        expireDate = new Date();
        if (photo) {
            photo.reset();
        }
    }

    function getMaxDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        return new Date(year + maxYearsInFuture, month, day);
    }

    function getMinDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        return new Date(year, month - 1, day);
    }

    const getProductImageUrl = (productId: string) =>
        `${AXIOS_CONFIG.baseURL}/product-image?productId=${productId}`;

    async function createProduct() {
        newProduct.expireDate = expireDate.toDateString();
        const createdProduct = await addProduct(newProduct, AXIOS_CONFIG);
        if (image) {
            await addProductImage(
                {
                    image: UTF16ToBlob(image),
                    productId: createdProduct.data._id,
                },
                AXIOS_CONFIG
            );
        }
        dispatch("create");
        close();
    }

    async function editProduct() {
        newProduct.expireDate = expireDate.toDateString();
        let updatedProduct: UpdateProductDto = {
            ...newProduct,
            productId: newProduct._id,
        };

        await updateProduct(updatedProduct, AXIOS_CONFIG);
        const productImagesResponse = await getProductImageList(AXIOS_CONFIG);
        if (productImagesResponse.data) {
            const productImage = productImagesResponse.data.find(
                (image) => image.productId === newProduct._id
            );
            if (productImage) {
                await deleteProductImage(
                    { productImageId: productImage._id },
                    AXIOS_CONFIG
                );
                await addProductImage(
                    {
                        image: UTF16ToBlob(image),
                        productId: newProduct._id,
                    },
                    AXIOS_CONFIG
                );
            }
        }
        dispatch("update");
        close();
    }

    function validate() {
        invalidMsg = "";
        valid = false;
        try {
            productSchema.validateSync(newProduct);
        } catch (err) {
            invalidMsg = err.message;
            return;
        }
        valid = true;
    }

    function onSave() {
        validate();
        isEdit ? editProduct() : createProduct();
    }

    function UTF16ToBlob(UTF17String: string) {
        let [_meta, base64Data] = UTF17String.split(",");
        let [contentTypeMeta, _encoding] = _meta.split(";");
        let [_contentTypeDataKey, contentType] = contentTypeMeta.split(":");
        let byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        console.log(blob);
        return blob;
    }
</script>

<Slide
    bind:open={createFirewallDialogOpen}
    disabled={isLoading}
    variant={"dismissible"}
>
    <svelte:fragment slot="title">Create Product</svelte:fragment>
    <svelte:fragment slot="content">
        <form
            bind:this={createProductForm}
            on:submit|preventDefault
            on:change={() => validate()}
        >
            <div class="textfield-custom-label" for="name">Name</div>
            <Textfield
                name="name"
                variant="outlined"
                bind:value={newProduct.name}
                disabled={isLoading}
                required
                on:change={() => validate()}
            />
            <div class="textfield-custom-label" for="ean">EAN</div>
            <Textfield
                name="ean"
                variant="outlined"
                bind:value={newProduct.ean}
                disabled={isLoading}
                required
                on:change={() => validate()}
            />
            <div class="textfield-custom-label" for="place">Place</div>
            <Select
                name="place"
                bind:value={newProduct.place}
                label="Select Menu"
                on:change={() => validate()}
            >
                {#each Object.values(KitchenPlaceEnum) as place}
                    <Option value={place}>{place}</Option>
                {/each}
            </Select>
            <div class="textfield-custom-label" for="expireDate">
                Expire Date
            </div>
            <DateInput
                max={getMaxDate()}
                min={getMinDate()}
                format={dateFormat}
                bind:value={expireDate}
                on:change={() => validate()}
            />
            <Photo
                imageUrl={isEdit ? getProductImageUrl(newProduct._id) : null}
                bind:this={photo}
                on:save={(event) => (image = event.detail)}
                on:change={() => validate()}
            />
        </form>
        {#if invalidMsg}
            <p style="color: red;">{invalidMsg}</p>
        {/if}
    </svelte:fragment>
    <svelte:fragment slot="actions">
        <Button disabled={!valid} ripple={false} on:click={onSave}>
            <Label>{isEdit ? "Update" : "Create"}</Label>
        </Button>
    </svelte:fragment>
</Slide>
