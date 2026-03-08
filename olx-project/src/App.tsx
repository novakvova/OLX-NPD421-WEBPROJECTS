import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { FavoritesProvider } from './context/FavoriteContext'
import { CartProvider } from './context/CartContext'
import { UserProvider } from './context/UserContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import FavoritesPage from './pages/FavoritesPage'
import CreatePage from './pages/CreatePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <UserProvider>
                    <CartProvider>
                        <FavoritesProvider>
                            <div className="min-h-screen bg-[#f8f9fa]">
                                <Navbar />
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/favorites" element={<FavoritesPage />} />
                                    <Route path="/create" element={<CreatePage />} />
                                    <Route path="/profile" element={<ProfilePage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                </Routes>
                            </div>
                        </FavoritesProvider>
                    </CartProvider>
                </UserProvider>
            </BrowserRouter>
        </Provider>
    )
}

export default App