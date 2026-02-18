const BASE_URL = 'http://localhost:5000/api'

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

export const CATEGORIES = [
    'Всі', 'Електроніка', 'Авто', 'Нерухомість',
    'Меблі', 'Одяг', 'Спорт', 'Дитячі товари', 'Інше',
]

export async function getProducts(
    search?: string,
    category?: string
): Promise<Product[]> {
    try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (category && category !== 'Всі') params.append('category', category)

        const res = await fetch(`${BASE_URL}/products?${params}`)
        if (!res.ok) throw new Error('Server error')
        return await res.json()
    } catch {
        return MOCK_PRODUCTS
    }
}
export const MOCK_PRODUCTS: Product[] = []