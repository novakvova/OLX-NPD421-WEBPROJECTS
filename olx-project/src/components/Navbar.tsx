import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Search, Heart, Plus, User, Bell, MapPin, Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/useCart'
import { useUser } from '../context/useUser'
import CartModal from './CartModal'

const NAV_LINKS = [
    { to: '/', label: 'Головна' },
    { to: '/favorites', label: 'Вибране' },
    { to: '/create', label: 'Створити' },
    { to: '/profile', label: 'Профіль' },
]

export default function Navbar() {
    const [search, setSearch] = useState('')
    const [mobileOpen, setMobileOpen] = useState(false)
    const [cartModalOpen, setCartModalOpen] = useState(false)
    const { cartItems } = useCart()
    const { user, setUser } = useUser()
    const navigate = useNavigate()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) navigate(`/?search=${encodeURIComponent(search)}`)
    }

    const handleLogout = () => {
        setUser(null)
        navigate('/')
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="w-full px-8">
                <div className="flex items-center gap-4 py-4">
                    <NavLink to="/" className="flex-shrink-0 no-underline">
                        <span className="text-[#0057b8] font-black italic text-4xl" style={{ fontFamily: 'Georgia, serif' }}>OLX</span>
                    </NavLink>

                    <button className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-blue-50 text-[#0057b8] text-base font-semibold whitespace-nowrap flex-shrink-0">
                        <MapPin size={18} strokeWidth={2.5} />
                        Вся Україна
                    </button>

                    <form onSubmit={handleSearch} className="flex flex-1 gap-3">
                        <div className="relative flex-1">
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Що шукаєте?"
                                   className="w-full pl-5 pr-12 py-3.5 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-800 text-base font-medium outline-none focus:border-[#0057b8] focus:bg-white transition-all" />
                            <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={2.5} />
                        </div>
                        <button type="submit" className="bg-[#0057b8] hover:bg-[#0046a0] text-white font-bold px-7 py-3.5 rounded-2xl text-base transition-colors flex-shrink-0">Знайти</button>
                    </form>

                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                        <NavLink to="/favorites" className="p-3 text-gray-400 hover:text-[#0057b8] hover:bg-blue-50 rounded-xl transition-colors">
                            <Heart size={24} strokeWidth={2} />
                        </NavLink>
                        <button className="relative p-3 text-gray-400 hover:text-[#0057b8] hover:bg-blue-50 rounded-xl transition-colors">
                            <Bell size={24} strokeWidth={2} />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <NavLink to="/profile" className="p-3 text-gray-400 hover:text-[#0057b8] hover:bg-blue-50 rounded-xl transition-colors">
                            <User size={24} strokeWidth={2} />
                        </NavLink>

                        {user && (
                            <button className="relative p-3 text-gray-400 hover:text-[#0057b8] hover:bg-blue-50 rounded-xl transition-colors" onClick={() => setCartModalOpen(true)}>
                                <ShoppingCart size={24} strokeWidth={2} />
                                {cartItems.length > 0 && (
                                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                    {cartItems.length}
                  </span>
                                )}
                            </button>
                        )}

                        {!user ? (
                            <>
                                <NavLink to="/login" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition">Увійти</NavLink>
                                <NavLink to="/register" className="px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded transition">Реєстрація</NavLink>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded transition">Вихід</button>
                        )}

                        <NavLink to="/create" className="flex items-center gap-2 bg-[#0057b8] hover:bg-[#0046a0] text-white font-bold px-5 py-3.5 rounded-2xl text-base transition-colors ml-2">
                            <Plus size={20} strokeWidth={3} />
                            Додати
                        </NavLink>
                    </div>

                    <button className="md:hidden p-2 text-gray-500" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                <nav className="hidden md:flex items-center gap-2 border-t border-gray-100">
                    {NAV_LINKS.map(link => (
                        <NavLink key={link.to} to={link.to} end={link.to === '/'}
                                 className={({ isActive }) => `px-5 py-3.5 text-base font-semibold transition-all border-b-2 ${isActive ? 'text-[#0057b8] border-[#0057b8]' : 'text-gray-600 border-transparent hover:text-[#0057b8]'}`}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
                    {NAV_LINKS.map(link => (
                        <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setMobileOpen(false)}
                                 className={({ isActive }) => `block px-5 py-4 rounded-xl text-base font-semibold ${isActive ? 'text-[#0057b8] bg-blue-50' : 'text-gray-600'}`}>
                            {link.label}
                        </NavLink>
                    ))}
                    {!user ? (
                        <div className="flex flex-col gap-2 mt-3">
                            <NavLink to="/login" className="px-4 py-2 text-white bg-blue-600 rounded">Увійти</NavLink>
                            <NavLink to="/register" className="px-4 py-2 text-blue-600 border border-blue-600 rounded">Реєстрація</NavLink>
                        </div>
                    ) : (
                        <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-600 rounded mt-3">Вихід</button>
                    )}
                </div>
            )}

            <CartModal open={cartModalOpen} onClose={() => setCartModalOpen(false)} />
        </header>
    )
}