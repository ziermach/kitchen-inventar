export const AXIOS_CONFIG = {
    baseURL: "http://localhost:3000",
    headers: { "Access-Control-Allow-Origin": "*" },
}
export const getProductImageUrl = (productId: string) => `${AXIOS_CONFIG.baseURL}/product-image?productId=${productId}`;