import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown, Loader2 } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useGetProductsQuery } from '../services/productsApi'
import { CATEGORIES, SORT_OPTIONS } from '../constant/Categories'

export default function HomePage() {
    const [searchParams] = useSearchParams()
    const [activeCategory, setActiveCategory] = useState('Всі')
    const [sortBy, setSortBy] = useState('Новіші')
    const [showSort, setShowSort] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const ITEMS_PER_PAGE = 20
    const search = searchParams.get('search') || ''

    const { data: products = [], isLoading } = useGetProductsQuery({
        category: activeCategory !== 'Всі' ? activeCategory : undefined,
    })

    const searchWords = search.toLowerCase().split(/\s+/).filter(Boolean)

    const filteredProducts = products.filter(product =>
        searchWords.every(word => product.title.toLowerCase().includes(word))
    )

    const sorted = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'Дешевші') return a.price - b.price
        if (sortBy === 'Дорожчі') return b.price - a.price
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE))
    const safePage = Math.min(currentPage, totalPages)
    const paginatedProducts = sorted.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    )

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat)
        setCurrentPage(1)
    }

    const handleSortChange = (opt: string) => {
        setSortBy(opt)
        setShowSort(false)
        setCurrentPage(1)
    }

    const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1))
    const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
    const handlePageClick = (page: number) => setCurrentPage(page)

    return (
        <main className="min-h-screen bg-[#f5f7fa]">
            <div className="max-w-[1400px] mx-auto px-8 py-8">

                <div className="flex gap-4 overflow-x-auto pb-4 mb-10 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`flex-shrink-0 px-8 py-4 rounded-2xl text-lg font-bold border-2 transition-all ${
                                activeCategory === cat
                                    ? 'bg-[#0057b8] border-[#0057b8] text-white shadow-md'
                                    : 'bg-white border-[#dde6f0] text-[#4a6076] hover:border-[#0057b8] hover:text-[#0057b8]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div className="text-lg font-medium text-gray-600">
                        {isLoading ? (
                            <span className="flex items-center gap-3 text-[#0057b8] text-lg">
                <Loader2 size={22} className="animate-spin" />
                Завантаження...
              </span>
                        ) : (
                            <span className="text-lg">
                <strong className="text-gray-900 text-xl">{sorted.length}</strong> оголошень
                                {search && <> за «<strong className="text-[#0057b8]">{search}</strong>»</>}
                                {activeCategory !== 'Всі' && <> · {activeCategory}</>}
              </span>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowSort(!showSort)}
                            className="flex items-center gap-3 bg-white border-2 border-[#dde6f0] rounded-2xl px-6 py-4 text-lg font-semibold text-[#4a6076] hover:border-[#0057b8] transition-all"
                        >
                            <SlidersHorizontal size={22} strokeWidth={2.5} />
                            {sortBy}
                            <ChevronDown size={20} strokeWidth={2.5} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} />
                        </button>
                        {showSort && (
                            <div className="absolute right-0 top-full mt-2 bg-white border border-[#dde6f0] rounded-2xl overflow-hidden z-10 shadow-xl min-w-[200px]">
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => handleSortChange(opt)}
                                        className={`w-full text-left px-6 py-4 text-lg font-semibold transition-colors ${
                                            sortBy === opt
                                                ? 'bg-[#0057b8] text-white'
                                                : 'text-[#4a6076] hover:bg-[#f0f6ff] hover:text-[#0057b8]'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border-2 border-[#edf2f7]">
                                <div className="bg-gray-100" style={{ aspectRatio: '4/3' }} />
                                <div className="p-5 space-y-3">
                                    <div className="h-6 bg-gray-100 rounded-lg w-1/2" />
                                    <div className="h-4 bg-gray-50 rounded-lg" />
                                    <div className="h-4 bg-gray-50 rounded-lg w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : paginatedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 280px)' }}>
                        <div className="text-9xl mb-8">🔍</div>
                        <h2 className="text-3xl font-black text-gray-700 mb-3">Нічого не знайдено</h2>
                        <p className="text-gray-400 text-lg mb-8">Спробуйте змінити категорію або пошуковий запит</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {paginatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>

                        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                            <button
                                onClick={handlePrev}
                                disabled={safePage === 1}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Назад
                            </button>

                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageClick(i + 1)}
                                    className={`px-4 py-2 rounded hover:bg-[#0057b8] hover:text-white transition ${
                                        safePage === i + 1 ? 'bg-[#0057b8] text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={handleNext}
                                disabled={safePage === totalPages}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Далі
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}