import { Heart } from 'lucide-react'

export default function FavoritesPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-black text-gray-800 mb-6">Вибране</h1>
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <Heart size={64} className="text-gray-200 mb-4" />
                <h2 className="text-xl font-bold text-gray-500 mb-2">Список порожній</h2>
                <p className="text-gray-400 text-sm">
                    Натискайте ♡ на оголошеннях, щоб зберегти їх тут
                </p>
            </div>
        </main>
    )
}