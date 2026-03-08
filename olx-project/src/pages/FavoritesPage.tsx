import ProductCard from "../components/ProductCard";
import { useFavorites } from "../context/useFavorites.ts";
import type { Product } from "../services/productsApi";

export default function FavoritesPage() {
    const { favorites } = useFavorites();

    if (favorites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
                <div className="text-9xl mb-8">💔</div>
                <h2 className="text-3xl font-black text-gray-700 mb-3">У вас немає вибраного</h2>
                <p className="text-gray-400 text-lg">Додайте товари до вибраного, натиснувши ❤️</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f5f7fa]">
            <div className="max-w-[1400px] mx-auto px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">Вибране</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {favorites.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </main>
    );
}