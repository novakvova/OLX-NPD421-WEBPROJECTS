import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Search, Heart, Plus, User, Bell, Menu, X, MapPin } from 'lucide-react'

const NAV_LINKS = [
    { to: '/', label: 'Головна' },
    { to: '/favorites', label: 'Вибране' },
    { to: '/create', label: 'Створити' },
    { to: '/profile', label: 'Профіль' },
]

export default function Navbar() {
    const [search, setSearch] = useState('')
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) navigate(`/?search=${encodeURIComponent(search)}`)
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-[1800px] mx-auto px-10">

                {/* TOP ROW */}
                <div className="flex items-center gap-4 py-4">

                    {/* Logo */}
                    <NavLink to="/" className="flex-shrink-0">
            <span className="text-[#1976d2] text-[48px] font-black italic tracking-wide leading-none">
              OLX
            </span>
                    </NavLink>

                    {/* Location */}
                    <button className="hidden xl:flex items-center gap-2 text-gray-500 hover:text-[#1976d2] text-lg whitespace-nowrap transition-colors font-medium">
                        <MapPin size={20} strokeWidth={2.5} />
                        <span>Вся Україна</span>
                    </button>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 flex gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Пошук оголошень..."
                                className="w-full pl-5 pr-14 py-4 rounded-xl text-lg bg-gray-50 border-2 border-gray-200 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#1976d2]/30 focus:border-[#1976d2] transition-all font-medium"
                            />
                            <Search
                                size={22}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                strokeWidth={2.5}
                            />
                        </div>
                        <button
                            type="submit"
                            className="hidden sm:block bg-[#1976d2] hover:bg-[#1565c0] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-sm"
                        >
                            Знайти
                        </button>
                    </form>

                    {/* Desktop icons */}
                    <div className="hidden xl:flex items-center gap-2">
                        <NavLink
                            to="/favorites"
                            className="p-3 text-gray-400 hover:text-[#1976d2] hover:bg-blue-50 rounded-xl transition-colors"
                            title="Вибране"
                        >
                            <Heart size={26} strokeWidth={2.5} />
                        </NavLink>
                        <button
                            className="relative p-3 text-gray-400 hover:text-[#1976d2] hover:bg-blue-50 rounded-xl transition-colors"
                            title="Сповіщення"
                        >
                            <Bell size={26} strokeWidth={2.5} />
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                        </button>
                        <NavLink
                            to="/profile"
                            className="p-3 text-gray-400 hover:text-[#1976d2] hover:bg-blue-50 rounded-xl transition-colors"
                            title="Профіль"
                        >
                            <User size={26} strokeWidth={2.5} />
                        </NavLink>
                        <NavLink
                            to="/create"
                            className="ml-2 flex items-center gap-2 bg-[#1976d2] hover:bg-[#1565c0] text-white font-bold px-8 py-4 rounded-xl text-xl transition-colors shadow-md"
                        >
                            <Plus size={22} strokeWidth={3} />
                            Додати
                        </NavLink>
                    </div>

                    {/* Mobile burger */}
                    <button
                        className="xl:hidden p-3 text-gray-500"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* NAV LINKS */}
                <nav className="hidden xl:flex items-center gap-1 border-t border-gray-100 py-2">
                    {NAV_LINKS.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) =>
                                `px-6 py-2.5 rounded-lg text-lg font-semibold transition-colors ${
                                    isActive
                                        ? 'text-[#1976d2] bg-blue-50'
                                        : 'text-gray-600 hover:text-[#1976d2] hover:bg-blue-50'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* MOBILE MENU */}
            {mobileOpen && (
                <div className="xl:hidden border-t border-gray-100 bg-white">
                    <nav className="flex flex-col px-6 py-3">
                        {NAV_LINKS.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `px-5 py-4 rounded-xl text-lg font-semibold border-b border-gray-50 last:border-0 transition-colors ${
                                        isActive ? 'text-[#1976d2] bg-blue-50' : 'text-gray-600'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}