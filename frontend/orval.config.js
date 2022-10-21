const baseOutputConfig = {
    workspace: 'src/api',
    mode: 'tags-split',
    schemas: 'model',
    mock: true,
    override: {
        query: {
            useQuery: true,
            useInfinite: true,
            useInfiniteQueryParam: 'nextId',
            options: {
                staleTime: 10000,
            },
        },
    },
}

module.exports = {
    'product': {
        input: 'http://localhost:3000/api-yaml',
        output: {
            ...baseOutputConfig,
            target: 'product.client.ts',
        },
    },
    'product-image': {
        input: 'http://localhost:3000/api-yaml',
        output: {
            ...baseOutputConfig,
            target: 'product-image.client.ts',
        },
    },
};