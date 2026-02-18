import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown, Loader2 } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { getProducts, CATEGORIES } from '../services/api'
import type { Product } from '../services/api'

const SORT_OPTIONS = ['Новіші', 'Дешевші', 'Дорожчі']

export default function HomePage() {
    const [searchParams] = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('Всі')
    const [sortBy, setSortBy] = useState('Новіші')
    const [showSort, setShowSort] = useState(false)

    const search = searchParams.get('search') || ''

    useEffect(() => {
        let cancelled = false

        const load = async () => {
            setLoading(true)
            const data = await getProducts(search, activeCategory)
            if (!cancelled) {
                setProducts(data)
                setLoading(false)
            }
        }

        void load()

        return () => { cancelled = true }
    }, [search, activeCategory])

    const sorted = [...products].sort((a, b) => {
        if (sortBy === 'Дешевші') return a.price - b.price
        if (sortBy === 'Дорожчі') return b.price - a.price
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return (
        <main className="max-w-[1800px] mx-auto px-10 py-8">

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide mb-8">
                {CATEGORIES.map((cat: string) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-shrink-0 px-6 py-3 rounded-xl text-lg font-bold border-2 transition-all ${
                            activeCategory === cat
                                ? 'bg-[#1976d2] border-[#1976d2] text-white shadow-md'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-[#1976d2] hover:text-[#1976d2] shadow-sm'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
                <div className="text-lg text-gray-600">
                    {loading ? (
                        <span className="flex items-center gap-2">
              <Loader2 size={20} className="animate-spin text-[#1976d2]" strokeWidth={3} />
              <span className="text-lg font-medium">Завантаження...</span>
            </span>
                    ) : (
                        <span className="text-lg font-medium">
              <strong className="text-gray-900 text-xl font-bold">{sorted.length}</strong> оголошень
                            {search && (
                                <> за «<strong className="text-[#1976d2]">{search}</strong>»</>
                            )}
            </span>
                    )}
                </div>

                {/* Sort */}
                <div className="relative">
                    <button
                        onClick={() => setShowSort(!showSort)}
                        className="flex items-center gap-2 bg-white border-2 border-gray-300 rounded-xl px-5 py-3 text-lg font-semibold text-gray-700 hover:border-[#1976d2] transition-colors shadow-sm"
                    >
                        <SlidersHorizontal size={20} strokeWidth={2.5} />
                        <span>{sortBy}</span>
                        <ChevronDown
                            size={18}
                            strokeWidth={2.5}
                            className={`transition-transform ${showSort ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {showSort && (
                        <div className="absolute right-0 top-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-10 min-w-[160px] overflow-hidden">
                            {SORT_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => { setSortBy(opt); setShowSort(false) }}
                                    className={`w-full text-left px-5 py-3.5 text-lg font-semibold transition-colors ${
                                        sortBy === opt
                                            ? 'bg-[#1976d2] text-white'
                                            : 'text-gray-700 hover:bg-blue-50'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border-2 border-gray-200 shadow-sm">
                            <div className="h-64 bg-gray-200" />
                            <div className="p-5 space-y-3">
                                <div className="h-6 bg-gray-200 rounded-lg w-2/3" />
                                <div className="h-5 bg-gray-100 rounded-lg" />
                                <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="text-[100px] mb-6 leading-none">🔍</div>
                    <h2 className="text-3xl font-bold text-gray-700 mb-3">Нічого не знайдено</h2>
                    <p className="text-gray-500 text-xl">Спробуйте змінити категорію або пошуковий запит</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {sorted.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </main>
    )
}