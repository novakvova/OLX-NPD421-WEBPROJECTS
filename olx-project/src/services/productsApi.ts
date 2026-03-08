import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Product {
    id: number
    title: string
    price: number
    location: string
    category: string
    imageUrl: string
    createdAt: string
    isFavorite?: boolean
}

export interface GetProductsParams {
    search?: string
    category?: string
}

export interface CreateProductRequest {
    title: string
    price: number
    location: string
    category: string
    imageUrl: string
    userId: number
}

export interface ToggleFavoriteResponse {
    isFavorite: boolean
}

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:5000/api'

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({

        getProducts: builder.query<Product[], GetProductsParams>({
            query: ({ search, category } = {}) => {
                const params = new URLSearchParams()
                if (search) params.append('search', search)
                if (category && category !== 'Всі') params.append('category', category)
                return `products?${params}`
            },
            providesTags: ['Product'],
        }),

        createProduct: builder.mutation<Product, CreateProductRequest>({
            query: (body) => ({
                url: 'products',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Product'],
        }),

        toggleFavorite: builder.mutation<ToggleFavoriteResponse, { id: number; userId: number }>({
            query: ({ id, userId }) => ({
                url: `products/${id}/favorite?userId=${userId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Product'],
        }),
    }),
})

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useToggleFavoriteMutation,
} = productsApi