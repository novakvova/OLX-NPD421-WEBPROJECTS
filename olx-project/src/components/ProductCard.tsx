import { useState } from 'react'
import { Heart, MapPin } from 'lucide-react'
import type { Product } from '../services/api'

interface Props {
    product: Product
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 60) return `${mins} хв`
    if (hours < 24) return `${hours} год`
    if (days === 1) return 'Вчора'
    return `${days} дн.`
}

export default function ProductCard({ product }: Props) {
    const [isFav, setIsFav] = useState(product.isFavorite ?? false)

    return (
        <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-[#1976d2] hover:shadow-xl transition-all duration-200 cursor-pointer group">

            {/* Image */}
            <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                    onClick={e => { e.stopPropagation(); setIsFav(!isFav) }}
                    className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                >
                    <Heart
                        size={22}
                        strokeWidth={2.5}
                        className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                </button>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-[#1976d2] text-xl font-black mb-2">
                    {product.price.toLocaleString('uk-UA')} ₴
                </p>
                <p className="text-gray-700 text-base leading-snug line-clamp-2 mb-3 min-h-[48px] font-medium">
                    {product.title}
                </p>
                <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-400 min-w-0">
                        <MapPin size={15} className="flex-shrink-0" strokeWidth={2.5} />
                        <span className="text-sm truncate font-medium">{product.location}</span>
                    </div>
                    <span className="text-sm text-gray-300 flex-shrink-0 ml-2 font-medium">
            {timeAgo(product.createdAt)}
          </span>
                </div>
            </div>
        </div>
    )
}